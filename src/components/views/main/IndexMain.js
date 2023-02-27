import { useLayoutEffect, useState } from 'react';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';
import Part4 from './Part4';

function Main() {

  const [screenHeights, setScreenHeights] = useState([]);

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
      // console.log('checked');
    }
  }, []);

  // FullPage Wheel 함수
  const wheelHandle = (e) => {
    e.preventDefault(); // 브라우저의 wheel event 를 막음
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
  useLayoutEffect(() => {
    window.addEventListener('wheel', wheelHandle, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheelHandle, { passive: false });
    };
  }, [screenHeights]);

  return (
    <div className="Index">
      <Part1 />
      <Part2 />
      <Part3 />
      <Part4 />
    </div>
  );
}

export default Main;