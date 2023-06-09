import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TradePage from './pages/trade/TradePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/trade" element={<TradePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;