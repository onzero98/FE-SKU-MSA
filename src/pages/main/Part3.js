import React from 'react';
import RankingTable from '../RankingTable';

export default function Part3(props) {
  const { styles } = props;
  return (
    <section id='Part3' className={styles.Part3}>
      <RankingTable />
    </section>
  );
}
