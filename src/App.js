import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FuncionarioProvider } from './pages/FuncionarioContext';
import { LanguageProvider } from './i18n/LanguageContext';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Historico from './pages/Historico';
import Editar from './pages/Editar';
import Visualizar from './pages/Visualizar';
import VisualizarLogsLogin from './pages/VisualizarLogsLogin';
import VisualizarLogsEdicao from './pages/VisualizarLogsEdicao';
import CadastroUsuario from './pages/CadastroUsuario';

const PrivateRoute = ({ element, isAuth, onLogin }) => {
  const location = useLocation();

  if (isAuth){
    return React.cloneElement(element, { onLogin })
  }
  else{
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }
}

function App() {
  // Lê o token já na primeira renderização para não redirecionar ao login ao recarregar a página
  const [isAuth, setIsAuth] = useState(() => {
    const token = sessionStorage.getItem('token')
    return !!token && token.length >= 5
  })
  
  const handleLogin = (token) =>{
    sessionStorage.setItem('token', token);
    setIsAuth(true)
  }

  const logout = () =>{
    sessionStorage.removeItem('token')
    setIsAuth(false)
  }

  useEffect(() =>{
    const token = sessionStorage.getItem('token')
    if (!token || token.length < 5){
      logout()
    }
    else{
      setIsAuth(true)
    }
  }, [])

  return (
    <LanguageProvider>
    <FuncionarioProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login onLogin={handleLogin} /> }/>
          <Route path='/registro' element={<PrivateRoute element={<Registro/>} isAuth={isAuth} />} />
          <Route path='/historico' element={<PrivateRoute element={<Historico/>} isAuth={isAuth} />} />
          <Route path='/editar' element={<PrivateRoute element={<Editar/>} isAuth={isAuth} />} />
          <Route path='/visualizar' element={<PrivateRoute element={<Visualizar/>} isAuth={isAuth} />} />
          <Route path='/visualizarLogsLogin' element={<PrivateRoute element={<VisualizarLogsLogin/>} isAuth={isAuth} />} />
          <Route path='/visualizarLogsEdicao' element={<PrivateRoute element={<VisualizarLogsEdicao/>} isAuth={isAuth} />} />
          <Route path='/cadastroUsuario' element={<PrivateRoute element={<CadastroUsuario/>} isAuth={isAuth} />} />
        </Routes>
      </Router>  
    </FuncionarioProvider>
    </LanguageProvider>
  );
}

export default App;
