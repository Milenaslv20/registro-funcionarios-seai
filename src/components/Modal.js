import React from 'react'
import styles from '../pages/styles.module.css'

export default function Modal({isOpen, setIsOpen, message}) {
  if(!isOpen) return null

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h1>{message}</h1>
        <button onClick={() => setIsOpen(false)} className={styles.close_button}>X</button>
      </div>
    </div>
  );
}
