import styled from 'styled-components'

export const InputContainer = styled.div`
  margin: 4rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`

export const Range = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;
  background: #ddd;
  height: 0.75rem;
  display: flex;
  align-items: center;
`

export const RangeBackground = styled.div` 
  position: relative;
  height: 100%;
`

export const RangeThumb = styled.div`
  background-color: transparent;
  font-size: 2rem;
  position: absolute;
  cursor: pointer;

  span::selection { 
    background: none; 
  }
`

export const ButtonSelector = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 5px;
  background-color: hsl(0, 0%, 50%);

  > div {
    cursor: pointer;
  }

  span::selection { 
    background: none; 
  }
`