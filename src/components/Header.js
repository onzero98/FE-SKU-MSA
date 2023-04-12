import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { showToast } from './Modal';
import styles from '../styles/Header.module.css';

function Header() {

  const [isLoggedin, setIsLoggedin] = useState(!!sessionStorage.getItem("jwt-token"));

  const handleLogout = () => {
    sessionStorage.removeItem("jwt-token");
    setIsLoggedin(false);
  };

  const handleClick = (event) => {
    if (!sessionStorage.getItem('jwt-token')) {
      event.preventDefault();
      showToast('error', '로그인 먼저 하세요.', {
        toastClassName: styles.toast,
      });
    }
  };

  return (
    <>
    <header className={`${styles.header} ${styles.fixedHeader}`}>
      <div className={styles.leftMenu}>
        <h1 className={styles.logo}>MONKEYSTOCK</h1>
        <nav className={styles.navMenu}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/trade" className={styles.navLink} onClick={handleClick}>
            Trade
          </Link>
          <Link to="/wallet" className={styles.navLink} onClick={handleClick}>
            Wallet
          </Link>
        </nav>
      </div>
      <div className={styles.rightMenu}>
      { isLoggedin ? (
          <a href='#' className={`${styles.loginButton} ${styles.navLink}`} onClick={handleLogout}>로그아웃</a>
      ):(
        <>
          <Link to="/login" className={`${styles.loginButton} ${styles.navLink}`}>
            Login
          </Link>
          <Link to="/signup" className={`${styles.signupButton} ${styles.navLink}`}>
            Sign Up
          </Link>
        </>
      )}
      </div>
    </header>
    <ToastContainer className={styles.Toastify__toast}/>
    </>
  );
}

export default Header;
