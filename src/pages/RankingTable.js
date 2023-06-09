import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from '../styles/RankingTable.module.css';

const RankingTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cellChanged, setCellChanged] = useState({});
  const dataRef = useRef([]);


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
    const socket = io("http://localhost:8081", { path: "/stock-prices-main", transports: ['websocket'] });
  
    socket.on("stockDataMain", (newData) => {
      const changes = detectChangedCells(dataRef.current, newData);
      setCellChanged(changes);
      dataRef.current = newData;
      setData(newData);
      setIsLoading(false);
    });
  
    return () => {
      socket.disconnect(); // 소켓 연결 해제
    };
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setCellChanged({});
    }, 1000);
  
    return () => {
      clearTimeout(timer);
    };
  }, [cellChanged]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            <th>종목명</th>
            <th>현재가</th>
            <th>등락률</th>
            <th>거래량</th>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => (
          <tr key={stock.code}>
            <td style={{ textAlign: "left" }}>{stock.companyName}</td>
            <td className={`${
              stock.diffRate < 0
              ? styles.blue
              : stock.diffRate > 0
              ? styles.red : ""
            } ${cellChanged[stock.code]?.currentPrice ? styles.blink : ""}`}
            >
              {parseFloat(stock.currentPrice).toLocaleString()}
            </td>
            <td className={`${
              stock.diffRate < 0
              ? styles.blue
              : stock.diffRate > 0
              ? styles.red : ""
            } ${cellChanged[stock.code]?.diffRate ? styles.blink : ""}`}
            >
              {stock.diffRate > 0 ? "+" : ""}
              {parseFloat(stock.diffRate).toLocaleString()}%
            </td>
            <td className={`${ cellChanged[stock.code]?.tradeVolume ? styles.blink : "" }`}>
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