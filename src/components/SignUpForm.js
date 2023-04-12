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
      .post("http://localhost:8080/auth/signUp", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 201) {
          showToast('success', '회원가입 성공!', {
            toastClassName: styles.toast,
          });
          // navigate('/login');
        } else {
          
        }
      })
      .catch((error) => {
        const code = error.response.data.statusCode;
        if(code === 400){
          showToast('error', '아이디, 비밀번호를 정확하게 입력해주세요.', {
            toastClassName: styles.toast,
          });
        } else {
          showToast('error', '이미 존재하는 아이디 입니다.', {
            toastClassName: styles.toast,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <h2>회원가입</h2>
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
          {isLoading ? "처리 중..." : "회원가입"}
        </button>
        <Link to="/login" className={styles.signupButton}>
          로그인
        </Link>
      </form>
      <ToastContainer className={styles.Toastify__toast}/>
    </div>
  );
}

export default LoginForm;
