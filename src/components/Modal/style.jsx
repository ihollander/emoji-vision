import styled from "styled-components"

export const StyledModal = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &.open {
    opacity: 1;
    visibility: visible;
  }
`

export const ModalInner = styled.div`
  width: 600px;
  max-width: 100vw;
  height: 600px;
  max-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`
