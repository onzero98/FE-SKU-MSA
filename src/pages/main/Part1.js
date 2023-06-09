import { useEffect, useRef } from 'react';

export default function Part1(props) {
  const { styles } = props;
  return (
    <section id='Part1' className={styles.Part1}>
      원숭이도 주식 투자는 할 수 있어.
    </section>
  );
}