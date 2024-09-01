import styled from "styled-components"

export const StyledButton = styled.button`
  background-color: rgb(255, 248, 231);
  border: none;
  border-radius: 1.5em;
  font: 2rem monospace;
  margin: 0 0.5rem;
  cursor: pointer;
  font-size: 2rem;
  padding: 0.25rem 1rem;
  transition: all 0.1s;
  box-shadow: 0 5px 10px rgba(55, 55, 55, 0.5);

  &:focus,
  &:hover {
    outline: none;
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(55, 55, 55, 0.5);
  }

  &:active {
    outline: none;
    transform: translateY(0px);
    box-shadow: 0 10px 20px rgba(55, 55, 55, 0.5);
  }
`

export const StyledEmoji = styled.span`
  text-shadow: 1px 1px 3px #666;

  &::selection {
    background-color: transparent;
  }
`
