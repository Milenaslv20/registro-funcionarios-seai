import './App.css';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Historico from './pages/Historico';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/registro' element={<Registro/>} />
        <Route path='/historico' element={<Historico/>} />
      </Routes>
    </Router>
  );
}

export default App;
