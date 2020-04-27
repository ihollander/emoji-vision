import React from 'react'
import { Emoji, Button } from '../Shared'
import * as modalConsts from '../../constants/modal'
import { StyledModal, ModalInner, ModalActions } from './style'

const Modal = ({ show, setActiveModal, children }) => {

  const closeModal = e => {
    if (e.target.classList.contains("open")) {
      setActiveModal(modalConsts.NONE)
    }
  }

  return (
    <StyledModal onClick={closeModal} className={show && "open"}>
      <ModalInner>
        <ModalActions>
          <Button onClick={() => setActiveModal(modalConsts.NONE)}>
            <Emoji emoji="🙅‍♀️" label="close" />
          </Button>
        </ModalActions>
        {children}
      </ModalInner>
    </StyledModal>
  )
}

export default Modal