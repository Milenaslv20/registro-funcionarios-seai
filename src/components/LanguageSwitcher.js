import React from 'react'
import styles from '../pages/styles.module.css'
import { LANGUAGES, useLanguage } from '../i18n/LanguageContext'

export default function LanguageSwitcher({ variant = 'dark' }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      className={`${styles.lang_switch} ${variant === 'light' ? styles.lang_switch_light : ''}`}
      role='group'
      aria-label={t('Idioma')}
    >
      {Object.entries(LANGUAGES).map(([code, info]) => (
        <button
          key={code}
          type='button'
          className={lang === code ? styles.lang_active : ''}
          aria-pressed={lang === code}
          title={info.name}
          onClick={() => setLang(code)}
        >
          {info.label}
        </button>
      ))}
    </div>
  )
}
