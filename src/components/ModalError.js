import React from 'react'
import styles from '../pages/styles.module.css'

export default function ModalError({isOpen, setIsOpen, message}) {
  if(!isOpen) return null

  if(isOpen){
    return (
      <div className={styles.modal_overlay_error}>
        <div className={styles.modal_content_error}>
          <h1>{message}</h1>
          <button onClick={() => setIsOpen(false)} className={styles.close_button_error}>X</button>
        </div>
      </div>
    )
  }
}
