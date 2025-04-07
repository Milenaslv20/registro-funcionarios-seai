import React from 'react'
import styles from '../pages/styles.module.css'

export default function ModalError({openModalError, setOpenModalError, message, reload, onConfirm}) {
  if(!openModalError) return null

  const handleClose = () =>{
    setOpenModalError(false)
    if (reload){
      window.location.reload();
    }
  }

  const handleConfirm = () =>{
    if (onConfirm){
      onConfirm()
    }
    setOpenModalError(false);
  }

  if(openModalError){
    return (
      <div className={styles.modal_overlay_error}>
        <div className={styles.modal_content_error}>
          <button onClick={handleClose} className={styles.close_button_error}><span>X</span></button>
          <h1>{message}</h1>

          {onConfirm && (
            <button onClick={handleConfirm} className={styles.confirm_button}>Confirmar</button>
          )}
        </div>
      </div>
    )
  }
}
