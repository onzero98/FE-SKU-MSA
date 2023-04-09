import { useEffect, useRef } from 'react';
import { FaPowerOff } from "react-icons/fa";

function Header() {

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
          <div className='menu-items'><FaPowerOff className='login'/></div>
        </div>
      </div>
    </section>
  )
}

export default Header;