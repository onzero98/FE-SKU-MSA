import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showToast, UserCheck } from "../../components";
import styles from '../../styles/trade/TradeButton.module.css';

export default function TradeButton({ selectedStock, update }) {
  const [tradeType, setTradeType] = useState('B');
  const [stockData, setStockData] = useState(null);
  const [showUserCredit, setShowUserCredit] = useState(0);
  const [showUserStockData, setShowUserStockData] = useState(null);
  const [showUserOrderedStockAmount, setShowUserOrderedStockAmount] = useState(0);
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');


  // 보유 잔고를 업데이트하는 함수
  const updateUserCredit = () => {
    axios.post("http://localhost:8082/account/userCredit", {
      username: UserCheck()
    }).then((res)=>{
      setShowUserCredit(res.data);
    });
  }

  // 보유 주식을 업데이트 하는 함수
  const updateUserStock = () => {
    axios.post("http://localhost:8083/portfolio/getOnePortfolio", {
      username: UserCheck(),
      code: stockData.code
    }).then((res)=>{
      setShowUserStockData(res.data);
    });

    axios.post("http://localhost:8084/order/get/amount", {
      username: UserCheck(),
      code: stockData.code
    }).then((res)=>{
      setShowUserOrderedStockAmount(res.data);
    });
  }

  useEffect(()=> {
    updateUserCredit();
    if (stockData !== null) {
      updateUserStock();
    }
  }, [update, tradeType]);

  useEffect(() => {
    if (selectedStock) {
      setStockData(selectedStock);
      if (stockData !== null) {
        updateUserStock();
      }
    }
  }, [selectedStock]);

  const handleQuantityChange = (e) => {

    const value = e.target.value;
    const removedCommaValue = Number(value.replaceAll(",", ""));

    if (tradeType === 'B') {
      setBuyQuantity(removedCommaValue.toLocaleString());
    } else {
      setSellQuantity(removedCommaValue.toLocaleString());
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const removedCommaValue = Number(value.replaceAll(",", ""));

    if (tradeType === 'B') {
      setBuyPrice(removedCommaValue.toLocaleString());
    } else {
      setSellPrice(removedCommaValue.toLocaleString());
    }
  };
  
  
  const handleSubmit = () => {
    let bp = Number(buyPrice.replaceAll(",", ""));
    let bq = Number(buyQuantity.replaceAll(",", ""));
    let sp = Number(sellPrice.replaceAll(",", ""));
    let sq = Number(sellQuantity.replaceAll(",", ""));

    if(bp * bq > showUserCredit) {
      showToast('error', '금액이 부족합니다.', {
        toastClassName: styles.toast,
      });
      // return;
    }

    if(sq > showUserStockData.amount) {
      showToast('error', '주식 수량이 부족합니다.', {
        toastClassName: styles.toast,
      });
      return;
    }

    if(tradeType === 'B' && (bp === 0 || bq === 0)) {
      showToast('error', '입력에 빈 칸이 존재합니다.', {
        toastClassName: styles.toast,
      });
      return;
    }

    if(tradeType === 'S' && (sp === 0 || sq === 0)) {
      showToast('error', '입력에 빈 칸이 존재합니다.', {
        toastClassName: styles.toast,
      });
      return;
    }

    const data = {
      username: UserCheck(),
      method: tradeType,
      companyName: stockData.companyName,
      code: stockData.code,
      price: tradeType === 'B' ? bp : sp,
      amount: tradeType === 'B' ? bq : sq,
    };
  
    axios.post("http://localhost:8084/order/create", data)
      .then(response => {
        showToast('success', '요청을 보냈습니다.', {
          toastClassName: styles.toast,
        });
        updateUserCredit();
      })
      .catch(error => {
        showToast('error', '문제가 발생했습니다.', {
          toastClassName: styles.toast,
        });
      });
  };
  

  if (!stockData) {
    return null; 
  }

  return (
    <div className={styles.tradeContainer}>
      <div className={styles.tradeButton}>
        <button className={tradeType === 'B' ? styles.activeBuy : ''} onClick={() => {setTradeType('B'); setSellQuantity(''); setSellPrice('');}}>
          <span>매</span>
          <span>수</span>
        </button>
        <button className={tradeType === 'S' ? styles.activeSell : ''} onClick={() => {setTradeType('S'); setBuyQuantity(''); setBuyPrice('');}}>
          <span>매</span>
          <span>도</span>
        </button>
      </div>
      {tradeType === 'B' && (
        <div className={styles.tradePanel}>
          <div className={styles.between}> 
            <p>보유 잔고</p>
            <p>{parseFloat(showUserCredit).toLocaleString()}<span> KRW</span></p>
          </div>
          <div className={styles.between}>
            <p>매수 가능<span style={{fontSize:'16px'}}> (현재 가격 기준)</span></p>
            <p>{parseFloat(~~(showUserCredit/stockData.currentPrice)).toLocaleString()}<span> 주</span></p>
          </div>
          <div className={styles.between}>
            <p>매수 가능<span style={{fontSize:'16px'}}> (입력 가격 기준)</span></p>
            <p>{parseFloat(~~(showUserCredit/(Number(buyPrice.replaceAll(",", ""))))).toLocaleString()}<span> 주</span></p>
          </div>
          <div className={styles.between}>
            <p>주문 금액</p>
            <p>{parseFloat(Number(buyPrice.replaceAll(",", "")) * Number(buyQuantity.replaceAll(",", ""))).toLocaleString()}<span> KRW</span></p>
          </div>
          <p>가격(KRW)</p>
          <input type="text" value={buyPrice} min="0" onChange={handlePriceChange} placeholder="매수 가격" />
          <p>수량</p>
          <input type="text" value={buyQuantity} min="0" onChange={handleQuantityChange} placeholder="매수 수량" />
          <button className={`${styles.activeBuy} ${styles.submit}`} onClick={handleSubmit}>전송</button>
        </div>
      )}
      {tradeType === 'S' && (
       <div className={styles.tradePanel}>
        <div className={styles.between}> 
          <p>보유 수량</p>
          <p>{parseFloat(showUserStockData.amount + showUserOrderedStockAmount).toLocaleString()}<span> 주</span></p>
        </div>
        <div className={styles.between}>
          <p>매도 가능</p>
          <p>{parseFloat(showUserStockData.amount).toLocaleString()}<span> 주</span></p>
       </div>
       <div className={styles.between}>
          <p>예상 손익</p>
          <p>{parseFloat((Number(sellPrice.replaceAll(",", "")) - (~~showUserStockData.avgPrice)) * Number(sellQuantity.replaceAll(",", ""))).toLocaleString()}<span> KRW</span></p>
       </div>
       <div className={styles.between}>
          <p>주문 금액</p>
          <p>{parseFloat(Number(sellPrice.replaceAll(",", "")) * Number(sellQuantity.replaceAll(",", ""))).toLocaleString()}<span> KRW</span></p>
       </div>
       <p>가격(KRW)</p>
       <input type="text" value={sellPrice} min="0" onChange={handlePriceChange} placeholder="매도 가격" />
       <p>수량</p>
       <input type="text" value={sellQuantity} min="0" onChange={handleQuantityChange} placeholder="매도 수량" />
       <button className={`${styles.activeSell} ${styles.submit}`} onClick={handleSubmit}>전송</button>
     </div>
      )}
    </div>
  );
}