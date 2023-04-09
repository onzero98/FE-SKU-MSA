import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/views/main/IndexMain';
import Header from './components/outline/Header';
import './scss/style.scss';

function App() {
  return (
    <div className="App">
      <Header/>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;