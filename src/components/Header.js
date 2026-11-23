import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from '../pages/styles.module.css'

import logo from '../svg/logo.svg'
import EMPRESA from '../config/empresa'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { isAdmin } from '../api'

// Menu único do sistema. Administradores veem também logs e cadastro de usuário.
const LINKS_USUARIO = [
  { to: '/registro', label: 'Registrar Funcionário' },
  { to: '/historico', label: 'Histórico de Funcionários' },
]
const LINKS_ADMIN = [
  { to: '/visualizarLogsLogin', label: 'Logs Login' },
  { to: '/visualizarLogsEdicao', label: 'Logs Edição' },
  { to: '/cadastroUsuario', label: 'Cadastrar Usuário' },
]

// title: texto opcional exibido quando a página não está no menu (ex.: "Editar Dados")
export default function Header({ title }) {
  const { t } = useLanguage()
  const links = isAdmin() ? [...LINKS_USUARIO, ...LINKS_ADMIN] : LINKS_USUARIO
  return (
    <header className={styles.app_header}>
      <div className={styles.brand}>
        <img src={logo} alt='' className={styles.brand_logo} />
        <div className={styles.brand_text}>
          <strong>{EMPRESA.nome}</strong>
          <span>{t('Registro de Funcionários')}</span>
        </div>
      </div>

      <nav className={styles.header_nav}>
        {title && <span className={styles.header_title}>{t(title)}</span>}
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.header_link} ${isActive ? styles.header_link_active : ''}`}
          >
            {t(link.label)}
          </NavLink>
        ))}
      </nav>

      <LanguageSwitcher />
    </header>
  )
}
