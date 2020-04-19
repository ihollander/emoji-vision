import styled from 'styled-components'

export const ControlMenu = styled.div`
  display: flex;
  justify-content: center;
  width: 400px;
  height: 100%;
  margin: 0 auto;
  flex-wrap: wrap;
  color: white;
  background-color: rgba(0,0,0,0.5);
  padding: 2rem;

  h1 {
    text-decoration: underline;
  }
`

export const InputContainer = styled.div`
  margin: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  label {
    width: 20%;
  }

  input {
    width: 70%;
  }
  
  select {
    width: 70%;
  }
`
