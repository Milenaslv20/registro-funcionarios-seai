import React from 'react'
import styles from './styles.module.css'

import logoSeai from '../svg/logoSeai.svg'

function Login() {
  return (
    <div>
      <div className={styles.container_left}>
        <h1>Registro de Funcionários</h1>

        <img src={logoSeai}/>
      </div>

      <div className={styles.container_right}>
        <div className={styles.container_login}>
          <h1>Login</h1>

          <input id={styles.input_user} type='text' placeholder='Usuário' maxLength={20}></input>
          <input id={styles.input_password} type='password' placeholder='Senha' maxLength={8}></input>

          <button className={styles.button_login}>Entrar</button>
        </div>
      </div>
    </div>
  )
}

export default Login