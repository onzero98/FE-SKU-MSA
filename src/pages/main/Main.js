import { useLayoutEffect, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';
import Part4 from './Part4';
import styles from '../../styles/MainP.module.css';

function Main() {

  const [screenHeights, setScreenHeights] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // DOM 이전에 실행하여 clientHeight 를 먼저 잡기 위해 useLayoutEffect 사용
  useLayoutEffect(() => {
    const part1 = document.querySelector('#Part1');
    const part2 = document.querySelector('#Part2');
    const part3 = document.querySelector('#Part3');
    const part4 = document.querySelector('#Part4');

    if (part1 && part2 && part3 && part4) {
      setScreenHeights([
        part1.clientHeight,
        part2.clientHeight,
        part3.clientHeight,
        part4.clientHeight,
      ]);
    }

  }, []);

  // FullPage Wheel 함수
  const wheelHandle = (e) => {
    e.preventDefault(); // 브라우저의 wheel event 를 막음

    if (!isReady) {
      setIsReady(true);

      setTimeout(() => {
        setIsReady(false);
      }, 600);
    } else {
      return; // 한페이지가 다 내려가기전에 또다른 wheel 이벤트가 발생되는것을 방지
    }

    const currentScreenIndex = Math.round(window.scrollY / window.innerHeight);
    const deltaY = e.deltaY;
    const nextScreenIndex = currentScreenIndex + Math.sign(deltaY);

    if (nextScreenIndex >= 0 && nextScreenIndex < screenHeights.length) {
      window.scrollTo({
        top: nextScreenIndex * window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  // passive: false 를 주어 강제적으로 wheel 이벤트를 막음
  useEffect(() => {
    window.addEventListener('wheel', wheelHandle, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheelHandle, { passive: false });
    };
  }, [isReady]);

  return (
    <div className="Index">
      <Header />
      <Part1 styles={styles}/>
      <Part2 styles={styles}/>
      <Part3 styles={styles}/>
      <Part4 styles={styles}/>
    </div>
  );
}

export default Main;