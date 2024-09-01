import { StyledButton } from './style'

import React from 'react'

const Button = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  )
}

export default Button