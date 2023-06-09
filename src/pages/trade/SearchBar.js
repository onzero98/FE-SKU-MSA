import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from '../../styles/trade/SearchBar.module.css';
import { BsSearch } from 'react-icons/bs';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

export default function SearchBar({ onSelect }) {
  const [data, setData] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [cellChanged, setCellChanged] = useState({});
  const [hasHandleRowClickBeenCalled, setHasHandleRowClickBeenCalled] = useState(false);
  const selectedStockCodeRef = useRef(null);
  const dataRef = useRef([]);

  // 웹 소켓 연결
  useEffect(() => {
    const socket = io("http://localhost:8081", { path: "/stock-prices-all", transports: ['websocket'] });
  
    socket.on("stockDataAll", (newData) => {
      const changes = detectChangedCells(dataRef.current, newData);
      setCellChanged(changes);
      dataRef.current = newData;
      setData(newData);

      if (selectedStockCodeRef.current) {
        const newSelectedStock = newData.find(stock => stock.code === selectedStockCodeRef.current);
        if (newSelectedStock && (!selectedStock || newSelectedStock.currentPrice !== selectedStock.currentPrice)) {
          setSelectedStock(newSelectedStock);
        }
      }
    });
  
    handleHeaderClick('marketCapBillion')

    return () => {
      socket.disconnect(); // 소켓 연결 해제
    };
  }, []);

  // 탭 기준으로 연결
  useEffect(() => {
    const newSortedData = [...data].sort((a, b) => {
      if (sortField === null) {
        return 0;
      }
  
      let diff = a[sortField] - b[sortField];
  
      // 문자열 기준 정렬 처리
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        diff = a[sortField].localeCompare(b[sortField]);
      }
  
      if (sortOrder === 'asc') {
        return diff;
      } else {
        return -diff;
      }
    });
  
    setSortedData(newSortedData);
  }, [data, sortOrder, sortField]);

  // 로드 되고 첫번쨰로 시총큰 '삼성전자' 를 선택된 상태로 불러옴.
  useEffect(() => {
    if (!hasHandleRowClickBeenCalled && sortedData.length > 0) {
      const firstStock = sortedData[0];
      handleRowClick(firstStock);
      setHasHandleRowClickBeenCalled(true);
    }
  }, [sortedData]);

  // 선택된 주식 정보가 변경될 때마다 onSelect를 호출
  useEffect(() => {
    if (selectedStock) {
      selectedStockCodeRef.current = selectedStock.code;
      onSelect(selectedStock);
    }
  }, [selectedStock]);

  // 여러번 깜빡이는것을 방지
  useEffect(() => {
    const timer = setTimeout(() => {
      setCellChanged({});
    }, 1000);
  
    return () => {
      clearTimeout(timer);
    };
  }, [cellChanged]);

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
  
  const handleRowClick = (stock) => {
    setActiveRow(stock.code);
    setSelectedStock(stock);
  };

  const handleHeaderClick = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={styles.tableWrapper}>
      <section className={styles.searchSection}>
      <input
        type="text"
        placeholder="회사명 검색..."
        className={styles.searchInput}
        onChange={e => setSearchText(e.target.value)}
      />
      <span className={styles.searchIcon}>
        <BsSearch />
      </span>
    </section>
      <table className={styles.SearchTable}>
      <thead>
  <tr>
    <th>
      <div onClick={() => handleHeaderClick('marketCapBillion')}>
        회사명
        {sortField === 'marketCapBillion' && (sortOrder === 'asc' ? <AiOutlineArrowUp/> : <AiOutlineArrowDown/>)}
      </div>
    </th>
    <th>
      <div onClick={() => handleHeaderClick('currentPrice')}>
        현재가
        {sortField === 'currentPrice' && (sortOrder === 'asc' ? <AiOutlineArrowUp/> : <AiOutlineArrowDown/>)}
      </div>
    </th>
    <th>
      <div onClick={() => handleHeaderClick('diffRate')}>
        등락률
        {sortField === 'diffRate' && (sortOrder === 'asc' ? <AiOutlineArrowUp/> : <AiOutlineArrowDown/>)}
      </div>
    </th>
    <th>
      <div onClick={() => handleHeaderClick('tradeVolume')}>
        거래량
        {sortField === 'tradeVolume' && (sortOrder === 'asc' ? <AiOutlineArrowUp/> : <AiOutlineArrowDown/>)}
      </div>
    </th>
  </tr>
</thead>
      </table>
      <div style={{ maxHeight: "800px", overflowY: "auto" }}>
      <table className={styles.SearchTable}>
        <tbody>
          {sortedData.filter(stock => stock.companyName.includes(searchText)).map((stock) => (
          <tr
            className={activeRow === stock.code ? styles.active : ''} // 클릭된 요소에 대해 is-active 클래스 적용
            key={stock.code} 
            onClick={() => handleRowClick(stock)}
          >
            <td style={{ textAlign: "left" }}>{stock.companyName}</td>
            <td className={`${
              stock.diffRate < 0
              ? styles.blue
              : stock.diffRate > 0
              ? styles.red : ""
            } ${cellChanged[stock.code]?.currentPrice ? styles.blink : ""}`}>
              {parseFloat(stock.currentPrice).toLocaleString()}
            </td>
            <td className={`${
              stock.diffRate < 0
              ? styles.blue
              : stock.diffRate > 0
              ? styles.red : ""
            } ${cellChanged[stock.code]?.diffRate ? styles.blink : ""}`}>
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
    </div>
  );  
};