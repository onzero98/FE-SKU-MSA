import React, { useState} from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/LoginForm.module.css';
import { ToastContainer } from 'react-toastify';
import { showToast } from './Modal';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    axios
      .post("http://localhost:8080/auth/signIn", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.data) {
          sessionStorage.setItem("jwt-token", res.data.accessToken);
          navigate('/');
        } else {
          showToast('error', '잘못된 사용자 이름 혹은 패스워드 입니다.', {
            toastClassName: styles.toast,
          });
        }
      })
      .catch((error) => {
        showToast('error', '잘못된 사용자 이름 혹은 패스워드 입니다.', {
          toastClassName: styles.toast,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          id="username"
          value={username}
          className={styles.input} 
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          id="password"
          value={password}
          className={styles.input} 
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" disabled={isLoading} className={styles.loginButton}>
          {isLoading ? "처리 중..." : "로그인"}
        </button>
        <Link to="/signup" className={styles.signupButton}>
          회원가입
        </Link>
      </form>
      <ToastContainer className={styles.Toastify__toast}/>
    </div>
  );
}

export default LoginForm;
