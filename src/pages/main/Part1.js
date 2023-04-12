import { useEffect, useRef } from 'react';

export function Part1(props) {
    const { styles } = props;
    
    return (
        <section id="Part1" className={styles.Part1}>
            <div> 야, 원숭이도 주식투자 할 수 있어 </div>
        </section>
    )
}

export default Part1;