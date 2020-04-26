import React from 'react'
import { InputContainer } from './style'

const Emoji = ({ character, title }) => (
  <span role="img" aria-label={title}>{character}</span>
)

const Controls = ({
  fontSize, setFontSize,
  brightness, setBrightness,
  saturate, setSaturate,
  contrast, setContrast
}) => {
  return (
    <>
      <h1>Settings</h1>
      <InputContainer>
        <label>
          <Emoji character="📏" title="Emoji Size" />
        </label>
        <select value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}>
          {[4, 8, 10, 16].map(opt => <option key={opt} value={opt}>{opt}px</option>)}
        </select>
      </InputContainer>
      <InputContainer>
        <label>
          <Emoji character="☀️" title="Brightness" />
        </label>
        <input type="range" value={brightness} onChange={e => setBrightness(e.target.value)} min={0.0} max={2.0} step={0.1} />
      </InputContainer>
      <InputContainer>
        <label>
          <Emoji character="🌈" title="Saturation" />
        </label>
        <input type="range" value={saturate} onChange={e => setSaturate(e.target.value)} min={0.0} max={2.0} step={0.1} />
      </InputContainer>
      <InputContainer>
        <label>
          <Emoji character="☯️" title="Contrast" />
        </label>
        <input type="range" value={contrast} onChange={e => setContrast(e.target.value)} min={0.0} max={2.0} step={0.1} />
      </InputContainer>
    </>
  )
}

export default Controls