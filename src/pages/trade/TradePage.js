import { useLayoutEffect, useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import SearchBar from './SearchBar';
import CompanyChart from './CompanyChart';
import TradeLogs from './TradeLogs';
import TradeButton from './TradeButton';
import Portfolios from './Portfolios';
import styles from '../../styles/trade/Trade.module.css';

function TradePage() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [update, setUpdate] = useState(false);

  const handleSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleUpdate = useCallback(() => {
    setUpdate(prev => !prev);
  }, []);

  return (
    <>
      <Header/>
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <SearchBar onSelect={handleSelect}/>
        </div>
        <div className={styles.companyChart}>
          <CompanyChart selectedStock={selectedStock}/>
        </div>
        <div className={styles.portfolios}>
          <Portfolios/>
        </div>
        <div className={styles.tradeLogs}>
          <TradeLogs onUpdate={handleUpdate}/>
        </div>
        <div className={styles.tradeSection}>
          <TradeButton selectedStock={selectedStock} update={update}/>
        </div>
      </div>
    </>
  );
}

export default TradePage;
