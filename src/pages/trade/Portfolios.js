import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';
import { showToast, UserCheck } from "../../components";
import styles from '../../styles/trade/Portfolios.module.css';

export default function Portfolios() {

  const [stockData, setStockData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  // 웹 소켓 연결
  useEffect(() => {
    const socket = io("http://localhost:8083", { path: "/portfolio-all", transports: ['websocket'], query: { username: UserCheck() }});

    socket.on("portfolioAll", (newData) => {
      setPortfolio(newData);
    });

    return () => {
      socket.disconnect(); // 소켓 연결 해제
    };
  }, []);

  // 웹 소켓 연결
  useEffect(() => {
    const socket = io("http://localhost:8081", { path: "/stock-prices-all", transports: ['websocket'] });
  
    socket.on("stockDataAll", (newData) => {
      setStockData(newData);
    });

    return () => {
      socket.disconnect(); // 소켓 연결 해제
    };
  }, []);


  return (
    <section className={styles.container}>
      <div style={{ maxHeight: "800px", overflowY: "auto" }}>
        <table className={styles.Logtable}>
          <thead>
            <div>
              <tr>
                <th>회사명</th>
                <th>평가손익</th>
                <th>보유수량</th>
                <th>평균가</th>
              </tr>
              <tr>
                <th>회사코드</th>
                <th>수익률</th>
                <th>평가금액</th>
                <th>매입총금액</th>
              </tr>
            </div>
          </thead>
          <tbody>
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {portfolio.filter(list => list.amount !== 0).map((list, index) => {
                const matchingStockData = stockData.filter(stock => stock.code === list.code);
                let currentPrice = 0;
                if (matchingStockData.length > 0) {
                  currentPrice = matchingStockData[0].currentPrice;
                }

                const profitLoss = (currentPrice - list.avgPrice) * list.amount;
                const profitLossPercent = (profitLoss / list.boughtPrice * 100).toFixed(2);
                
                return (
                  <div key={index}>
                    <tr>
                      <td>{list.companyName}</td>
                      <td className={`${ profitLoss < 0 ? styles.blue : profitLoss > 0 ? styles.red : ""}`}>
                        {parseFloat(profitLoss).toLocaleString()}
                      </td>
                      <td>{parseFloat(list.amount).toLocaleString()}</td>
                      <td>{parseFloat(~~list.avgPrice).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>{list.code}</td>
                      <td className={`${ profitLossPercent < 0 ? styles.blue : profitLossPercent > 0 ? styles.red : ""}`}>
                        {parseFloat(profitLossPercent).toLocaleString()}%
                      </td>
                      <td>{parseFloat(currentPrice * list.amount).toLocaleString()}</td>
                      <td>{parseFloat(list.boughtPrice).toLocaleString()}</td>
                    </tr>
                  </div>
                )
              })}
            </div>
          </tbody>
        </table>
      </div>
      {/* <div className={styles.bottom}>
        총자산
      </div> */}
    </section>
  );
}
