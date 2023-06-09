import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';
import { showToast, UserCheck } from "../../components";
import styles from '../../styles/trade/TradeLogs.module.css';

export default function TradeLogs( props ) {

  const [orderList, setOrderList] = useState([]);
  const [chkLength, setChkLength] = useState(0);

  // 웹 소켓 연결
  useEffect(() => {
    const socket = io("http://localhost:8084", { path: "/order-list", transports: ['websocket'], query: { username: UserCheck() }});

    socket.on("orderListUSer", (newData) => {
      setOrderList(newData);
    });

    return () => {
      socket.disconnect(); // 소켓 연결 해제
    };
  }, []);

  // 주문리스트 변경에 따른 보유 자산 다시 확인 및 리스트 처리 확인 팝업
  useEffect(() => {
    if(chkLength > orderList.length){
      showToast('success', '처리가 완료되었습니다.', {
        toastClassName: styles.toast,
      });
      props.onUpdate();
    }
    setChkLength(orderList.length);
  }, [orderList.length]);
  

  const handleCancel = (list) => {
    axios.post("http://localhost:8084/order/cancel", {
      orderId: list.orderId,
      method: list.method,
      username: list.username,
      amount: list.amount,
      price: list.price
    }).then((res)=>{
      showToast('success', '취소 요청을 보냈습니다.', {
        toastClassName: styles.toast,
      });
    });
  }

  return (
    <section className={styles.container}>
      <table className={styles.Logtable}>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>회사명</th>
            <th>수량</th>
            <th>목표가격</th>
            <th></th>
          </tr>
        </thead>
      </table>
      <div style={{ maxHeight: "800px", overflowY: "auto" }}>
        <table className={styles.Logtable}>
          <tbody>
            {orderList.map((list) => (
              <tr 
                className={`${styles.Logtable} ${list.method === 'B' ? styles.buy : styles.sell}`}
                key={list.orderId}
              >
                <td>{list.orderId}</td>
                <td>{list.companyName}</td>
                <td>{parseFloat(list.amount).toLocaleString()}</td>
                <td>{parseFloat(list.price).toLocaleString()}</td>
                <td><div className={styles.cancel} onClick={() => handleCancel(list)}>주문취소</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
