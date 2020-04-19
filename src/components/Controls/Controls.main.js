import React from 'react'
import { InputContainer } from './style'

const Controls = ({
  resolution, setResolution,
  brightness, setBrightness,
  saturate, setSaturate,
  contrast, setContrast
}) => {
  return (
    <>
      <h1>Settings</h1>
      <InputContainer>
        <label>Resolution</label>
        <select value={resolution} onChange={e => setResolution(e.target.value)}>
          {[4, 8, 10, 12, 16].map(opt => <option key={opt} value={opt}>{opt}px</option>)}
        </select>
      </InputContainer>
      <InputContainer>
        <label>Brightness</label>
        <input type="range" value={brightness} onChange={e => setBrightness(e.target.value)} min={0.0} max={2.0} step={0.1} />
      </InputContainer>
      <InputContainer>
        <label>Saturation</label>
        <input type="range" value={saturate} onChange={e => setSaturate(e.target.value)} min={0.0} max={2.0} step={0.1} />
      </InputContainer>
      <InputContainer>
        <label>Contrast</label>
        <input type="range" value={contrast} onChange={e => setContrast(e.target.value)} min={0.0} max={2.0} step={0.1} />
      </InputContainer>
    </>
  )
}

export default Controls