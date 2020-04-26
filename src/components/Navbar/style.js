import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  background-color: rgba(55, 55, 55, 0.8);
  z-index: 1;
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