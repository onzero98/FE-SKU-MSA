import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Modal";
import LoginCheck from './LoginCheck';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonDisabled(!(username && password));
  }, [username, password]);

  useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "rgba(0, 38, 230, 0.7)";
  
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, []);

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
          navigate("/");
        } else {
          showToast("error", "잘못된 사용자 이름 혹은 패스워드 입니다.", {
            toastClassName: styles.toast,
          });
        }
      })
      .catch((error) => {
        showToast("error", "잘못된 사용자 이름 혹은 패스워드 입니다.", {
          toastClassName: styles.toast,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
    <LoginCheck />
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input
            type="text"
            placeholder="사용자 이름"
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
          <button
            type="submit"
            disabled={isButtonDisabled || isLoading}
            className={styles.loginButton}
            style={{ cursor: isButtonDisabled ? 'default' : 'pointer' }}
          >
            <div className={styles.arrowCircle} style={{ color: isButtonDisabled ? 'rgba(255, 255, 255, 0.5)' : 'white' }}>
              로그인
            </div>
          </button>
          <Link to="/signup" className={styles.navLinkButton}>
            회원가입
          </Link>
        </form>
      </div>
    </div>
    <ToastContainer className={styles.Toastify__toast} />
    </>
  );
}

export default LoginForm;
