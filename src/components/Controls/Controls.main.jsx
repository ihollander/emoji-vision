import { Button, Emoji } from "../Shared"
import Slider from "./Slider"
import { ButtonSelector, InputContainer } from "./style"

const SizeSelector = ({ emoji, label, size, selected, onClick }) => (
  <Button
    className={selected ? "selected" : undefined}
    onClick={onClick}
    style={{ fontSize: `${size * 3}px` }}
  >
    <Emoji emoji={emoji} label={label} />
  </Button>
)

const sizes = [4, 8, 10, 16]

const Controls = ({
  fontSize,
  setFontSize,
  brightness,
  setBrightness,
  saturate,
  setSaturate,
  contrast,
  setContrast,
  debug,
  setDebug,
}) => {
  return (
    <>
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
      <InputContainer>
        <ButtonSelector>
          {sizes.map((size) => (
            <SizeSelector
              key={size}
              emoji="😀"
              label="Size"
              selected={fontSize === size}
              size={size}
              onClick={() => setFontSize(size)}
            />
          ))}
        </ButtonSelector>
      </InputContainer>
      <InputContainer>
        <Button onClick={() => setDebug(!debug)}>
          <Emoji label="Palette" emoji={debug ? "🦋" : "🐛"} />
        </Button>
      </InputContainer>
    </>
  )
}

export default Controls
