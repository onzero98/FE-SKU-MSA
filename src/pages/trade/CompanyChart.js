import React, { useState, useEffect } from 'react';
import styles from '../../styles/trade/CompanyChart.module.css';

export default function CompanyChart({ selectedStock }) {
  const [stockData, setStockData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (selectedStock) {
      setStockData(selectedStock);
      setImageUrl(`https://ssl.pstatic.net/imgfinance/chart/item/area/day/${selectedStock.code}.png?sidcode=${Date.now()}`);
    }
  }, [selectedStock]);


  // 아직 데이터가 없는 경우 아무 것도 렌더링하지 않습니다.
  if (!stockData) {
    return null; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{stockData.companyName} <span className={styles.titleCode}>{stockData.code}</span></div>
      <div className={`${styles.price} ${
        stockData.diffRate < 0
        ? styles.blue
        : stockData.diffRate > 0
        ? styles.red : ""
      }`}>{parseFloat(stockData.currentPrice).toLocaleString()}
        <span className={`${styles.smallString} ${
          stockData.diffRate < 0
          ? styles.blue
          : stockData.diffRate > 0
          ? styles.red : ""
        }`}> {stockData.diffRate > 0 ? "+" : ""}{parseFloat(stockData.diffRate).toLocaleString()}%({stockData.previousPriceDifference > 0 ? '▲' : '▼'}{Math.abs(parseFloat(stockData.previousPriceDifference)).toLocaleString()})
        </span>
      </div>
      <img src={imageUrl} alt="Company Chart"/>
    </div>
  );
}
