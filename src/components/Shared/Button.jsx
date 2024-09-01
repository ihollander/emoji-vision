import { StyledButton } from './style'

const Button = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  )
}

export default Button
