import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  background-color: rebeccapurple;
  z-index: 1;
  box-shadow: 0px 2px 4px #333;
`

export const Nav = styled.nav`
  margin: 0.5rem 1rem;
`

export const Logo = styled.a`
  margin: 0.5rem 1rem;
  cursor: pointer;
  text-decoration: none;
`

export const Button = styled.button`
  background-color: transparent;
  border: none;
  font: 2rem monospace;
  margin: 0 1rem;
  cursor: pointer;
`