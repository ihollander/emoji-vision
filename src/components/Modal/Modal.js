import React from 'react'
import styled from 'styled-components'

export const StyledModal = styled.div`
  position: absolute; 
  top: 0; 
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.open {
    opacity: 1;
    visibility: visible;
  }
`

export const ModalInner = styled.div`
  width: 400px;
  height: 100%;
  margin: 0 auto;
  background-color: rgba(0,0,0,0.5);
  padding: 2rem;

  h1 {
    text-decoration: underline;
  }
`

const Modal = ({ show, setActiveModal, children }) => {

  const closeModal = e => {
    if (e.target.classList.contains("open")) {
      setActiveModal("NONE")
    }
  }

  return (
    <StyledModal onClick={closeModal} className={show && "open"}>
      <ModalInner>
        {children}
      </ModalInner>
    </StyledModal>
  )
}

export default Modal