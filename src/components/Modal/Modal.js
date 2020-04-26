import React from 'react'
import Emoji from '../Shared/Emoji'
import { StyledModal, ModalInner } from './style'

const Modal = ({ show, setActiveModal, children }) => {

  const closeModal = e => {
    if (e.target.classList.contains("open")) {
      setActiveModal("NONE")
    }
  }

  return (
    <StyledModal onClick={closeModal} className={show && "open"}>
      <ModalInner>
        <button onClick={() => setActiveModal("NONE")}>
          <Emoji emoji="🙅‍♀️" label="close" />
        </button>
        {children}
      </ModalInner>
    </StyledModal>
  )
}

export default Modal