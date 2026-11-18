import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from '../pages/styles.module.css'

import logo from '../svg/logo.svg'
import EMPRESA from '../config/empresa'

// links: [{ to: '/registro', label: 'Registrar Funcionário' }, ...]
// title: texto opcional exibido quando a página não está entre os links (ex.: "Editar Dados")
export default function Header({ links = [], title }) {
  return (
    <header className={styles.app_header}>
      <div className={styles.brand}>
        <img src={logo} alt='' className={styles.brand_logo} />
        <div className={styles.brand_text}>
          <strong>{EMPRESA.nome}</strong>
          <span>Registro de Funcionários</span>
        </div>
      </div>

      <nav className={styles.header_nav}>
        {title && <span className={styles.header_title}>{title}</span>}
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.header_link} ${isActive ? styles.header_link_active : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
