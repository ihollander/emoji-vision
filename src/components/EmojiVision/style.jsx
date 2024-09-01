import styled from "styled-components"

export const CanvasContainer = styled.div`
  max-width: 1080px;
  margin: 0 auto;

  canvas {
    width: 100%;
    max-height: calc(100vh - 6rem);
    background-color: #fff8e7;
  }

  @media screen and (min-width: 1080px) {
    canvas {
      box-shadow: 4px 4px 10px #000;
    }
  }
`
