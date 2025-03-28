import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FuncionárioProvider } from './pages/FuncionarioContext';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Historico from './pages/Historico';
import Editar from './pages/Editar';
import Visualizar from './pages/Visualizar';

function App() {
  return (
    <FuncionárioProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/registro' element={<Registro/>} />
          <Route path='/historico' element={<Historico/>} />
          <Route path='/editar' element={<Editar/>} />
          <Route path='/visualizar' element={<Visualizar/>} />
        </Routes>
      </Router>  
    </FuncionárioProvider>
  );
}

export default App;
