import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/views/main/IndexMain';
import './scss/style.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;