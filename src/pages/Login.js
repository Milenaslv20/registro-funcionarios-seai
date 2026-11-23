import React, { useState } from 'react'
import styles from './styles.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { isAuth } from '../isAuth';
import { useFuncionario } from './FuncionarioContext'

import logo from '../svg/logo.svg'
import EMPRESA from '../config/empresa'

import ModalError from '../components/ModalError';
import { Eye, EyeOff } from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'

function Login({ onLogin }) {
  const { t } = useLanguage()

  const[nomeUsuario, setNomeUsuario] = useState('')
  const[senhaUsuario, setSenhaUsuario] = useState('')
  const[mostrarSenha, setMostrarSenha] = useState(false)
  const[openModalError, setOpenModalError] = useState(false)
  const[modalMessageError, setModalMessageError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const { setUsuario } = useFuncionario();

  const from = location.state?.from || '/registro'

  const handleLogin = async (e) =>{
    e.preventDefault();
      const res = await isAuth(nomeUsuario, senhaUsuario)
      if (res.sucess){
        localStorage.setItem('nomeUsuario', nomeUsuario)
        onLogin(res.token)
        setUsuario(nomeUsuario);
        navigate(from);
        //navigate("/registro", { state: { usuario: usuario } });
      }
      else{
        setModalMessageError("Usuário ou senha incorretos")
        setOpenModalError(true)
        setNomeUsuario("")
        setSenhaUsuario("")
        document.getElementById("usuario").focus()
      }
    }

  return (
    <div className={styles.login_page}>
      <div className={styles.container_left}>
        <img src={logo} alt={`Logo ${EMPRESA.nome}`}/>
        <span className={styles.login_brand}>{EMPRESA.nomeCompleto}</span>
        <h1>{t('Registro de Funcionários')}</h1>
      </div>

      <div className={styles.container_right}>
        <div className={styles.login_lang}><LanguageSwitcher variant='light' /></div>
        {/* form: a tecla Enter em qualquer campo envia o login */}
        <form className={styles.container_login} onSubmit={handleLogin}>
          <h2>{t('Entrar')}</h2>
          <p>{t('Acesse com seu usuário e senha.')}</p>

          <label htmlFor='usuario'>{t('Usuário')}</label>
          <input id='usuario' type='text' placeholder={t('Seu usuário')} maxLength={25} autoComplete='off' value={nomeUsuario} onChange={(e) => {setNomeUsuario(e.target.value)}}></input>
          <label htmlFor='senha'>{t('Senha')}</label>
          <div className={styles.campo_senha}>
            <input id='senha' type={mostrarSenha ? 'text' : 'password'} placeholder={t('Sua senha')} maxLength={8} autoComplete='off' value={senhaUsuario} onChange={(e) => {setSenhaUsuario(e.target.value)}}></input>
            <button
              type='button'
              className={styles.botao_olho}
              onClick={() => setMostrarSenha((v) => !v)}
              aria-label={t(mostrarSenha ? 'Ocultar senha' : 'Mostrar senha')}
              title={t(mostrarSenha ? 'Ocultar senha' : 'Mostrar senha')}
            >
              {mostrarSenha ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>
          <button type='submit' className={styles.button_login}>{t('Entrar')}</button>
        </form>
      </div>
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError}/>
    </div>
  )
}

export default Login