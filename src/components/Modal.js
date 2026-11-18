import React from 'react'
import styles from '../pages/styles.module.css'
import { useLanguage } from '../i18n/LanguageContext'

export default function Modal({openModal, setOpenModal, message, reload}) {
  const { t } = useLanguage()
  if(!openModal) return null

  const handleClose = () =>{
    setOpenModal(false)
    if (reload){
      window.location.reload();
    }
  }

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h1>{t(message)}</h1>
        <button onClick={handleClose} className={styles.close_button}>X</button>
      </div>
    </div>
  );
}
