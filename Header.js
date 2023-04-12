import { useState, useEffect, useRef } from 'react';
import { FaPowerOff } from "react-icons/fa";
import LoginModal from "../views/modal/LoginModal"; // 로그인 모달 컴포넌트

function Header() {

  const [isLoggedin, setIsLoggedin] = useState(!!sessionStorage.getItem("jwt-token"));
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt-token");
    setIsLoggedin(false);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setIsLoggedin(!!sessionStorage.getItem("jwt-token"));
  };

  return (
    <section>
      <div id="Head">
        <div className='logo'>
          MONKEYSTOCK
        </div>
        <div className='menu'>
          <div className='menu-items'>메뉴</div>
          <div className='menu-items'>메뉴</div>
          <div className='menu-items'>메뉴</div>
          {isLoggedin ? (
            <div className='menu-items' onClick={handleLogout}>로그아웃</div>
          ) : (
            <div className='menu-items' onClick={handleLogin}>로그인</div>
          )}
          <div className='menu-items'><FaPowerOff className='login'/></div>
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={handleLoginModalClose} />}
    </section>
  )
}

export default Header;