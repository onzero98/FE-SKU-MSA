import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from '../styles/RankingTable.module.css';

const RankingTable = () => {
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('desc');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cellChanged, setCellChanged] = useState({});

// 변경된 셀을 감지하기 위해 데이터를 비교하는 함수
const detectChangedCells = (oldData, newData) => {
  const changes = {};

  newData.forEach((newStock) => {
    const oldStock = oldData.find((stock) => stock.code === newStock.code);
    if (oldStock) {
      if (oldStock.currentPrice !== newStock.currentPrice) {
        changes[newStock.code] = { ...changes[newStock.code], currentPrice: true };
      }
      if (oldStock.diffRate !== newStock.diffRate) {
        changes[newStock.code] = { ...changes[newStock.code], diffRate: true };
      }
      if (oldStock.tradeVolume !== newStock.tradeVolume) {
        changes[newStock.code] = { ...changes[newStock.code], tradeVolume: true };
      }
    }
  });
  return changes;
};

useEffect(() => {
  const socket = io("http://localhost:8081", { path: "/stock-prices" });

  socket.on("stockData", (newData) => {
    const changes = detectChangedCells(data, newData);
    setCellChanged(changes);
    setData(newData);
    setIsLoading(false);
  });

  return () => {
    socket.disconnect(); // 소켓 연결 해제
  };
}, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCellChanged({});
    }, 1000);
  
    return () => {
      clearTimeout(timer);
    };
  }, [cellChanged]);
  

  const sortedData = React.useMemo(() => {
    if (!data) return [];

    return Object.entries(data)
      .filter(([key, value]) => key !== 'errorCode' && key !== 'result')
      .map(([key, value]) => ({ ...value }))
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'price') return factor * (parseFloat(a.currentPrice) - parseFloat(b.currentPrice));
        if (sortBy === 'changeRate') return factor * (parseFloat(a.diffRate) - parseFloat(b.diffRate));
        if (sortBy === 'volume') return factor * (parseFloat(a.tradeVolume) - parseFloat(b.tradeVolume));
      })
      .slice(0, 7);
  }, [data, sortBy, sortOrder]);

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            <th>종목명</th>
            <th
              onClick={() => handleSort('price')}
              style={{ cursor: 'pointer' }}
              className={sortBy === 'price' ? styles.selected : ''}
            >
              현재가 {sortBy === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}
            </th>
            <th
              onClick={() => handleSort('changeRate')}
              style={{ cursor: 'pointer' }}
              className={sortBy === 'changeRate' ? styles.selected : ''}
            >
              등락률 {sortBy === 'changeRate' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}
            </th>
            <th
              onClick={() => handleSort('volume')}
              style={{ cursor: 'pointer' }}
              className={sortBy === 'volume' ? styles.selected : ''}
            >
              거래량 {sortBy === 'volume' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}
            </th>
          </tr>
        </thead>
        <tbody>
  {sortedData.map((stock) => (
    <tr key={stock.code}>
      <td style={{ textAlign: "left" }}>{stock.companyName}</td>
      <td
        className={`${
          stock.diffRate < 0
            ? styles.blue
            : stock.diffRate > 0
            ? styles.red
            : ""
        } ${cellChanged[stock.code]?.currentPrice ? styles.blink : ""}`}
      >
        {parseFloat(stock.currentPrice).toLocaleString()}
      </td>
      <td
        className={`${
          stock.diffRate < 0
            ? styles.blue
            : stock.diffRate > 0
            ? styles.red
            : ""
        } ${cellChanged[stock.code]?.diffRate ? styles.blink : ""}`}
      >
        {stock.diffRate > 0 ? "+" : ""}
        {parseFloat(stock.diffRate).toLocaleString()}%
      </td>
      <td
        className={`${
          cellChanged[stock.code]?.tradeVolume ? styles.blink : ""
        }`}
      >
        {parseFloat(stock.tradeVolume).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>


      </table>
    </div>
  );  
};
export default RankingTable;