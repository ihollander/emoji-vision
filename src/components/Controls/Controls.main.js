import React from 'react'
import Slider from './Slider'
import { InputContainer, ButtonSelector } from './style'
import Emoji from '../Shared/Emoji'

const SizeSelector = ({ emoji, label, size, selected, onClick }) => (
  <div onClick={onClick} style={{ fontSize: `${size * 3}px` }}>
    <Emoji emoji={emoji} label={label} />
  </div>
)

const sizes = [4, 8, 10, 16]

const Controls = ({
  fontSize, setFontSize,
  brightness, setBrightness,
  saturate, setSaturate,
  contrast, setContrast
}) => {
  return (
    <>
      <InputContainer>
        <ButtonSelector>
          {sizes.map(size => <SizeSelector key={size} emoji="😀" label="Size" selected={fontSize === size} size={size} onClick={() => setFontSize(size)} />)}
        </ButtonSelector>
      </InputContainer>
      <InputContainer>
        <Slider
          emoji="💡"
          label="brightness"
          value={brightness}
          onChange={setBrightness}
          min={0.0}
          max={2.0}
        />
      </InputContainer>
      <InputContainer>
        <Slider
          emoji="🌈"
          label="Saturation"
          value={saturate}
          onChange={setSaturate}
          min={0.0}
          max={2.0}
        />
      </InputContainer>
      <InputContainer>
        <Slider
          emoji="🌗"
          label="Contrast"
          value={contrast}
          onChange={setContrast}
          min={0.0}
          max={2.0}
        />
      </InputContainer>
    </>
  )
}

export default Controls