import useControls from "../hooks/useControls"
import { Button, Emoji, Slider } from "./Shared"

const sizes = [4, 8, 10, 16]

const SIZE_MAP = {
  4: "sm",
  8: "md",
  10: "lg",
  16: "xl",
}

const Controls = () => {
  const {
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
  } = useControls()

  return (
    <div className="flex flex-col items-center gap-8">
      <Slider
        emoji="💡"
        label="Brightness"
        value={brightness}
        onChange={setBrightness}
        min={0.0}
        max={2.0}
      />
      <Slider
        emoji="🌈"
        label="Saturation"
        value={saturate}
        onChange={setSaturate}
        min={0.0}
        max={2.0}
      />
      <Slider
        emoji="🌗"
        label="Contrast"
        value={contrast}
        onChange={setContrast}
        min={0.0}
        max={2.0}
      />
      <div className="flex w-full items-center justify-evenly">
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => setFontSize(size)}
            size={SIZE_MAP[size]}
            selected={fontSize === size}
          >
            <Emoji emoji="😀" label="Size" />
          </Button>
        ))}
      </div>
      <Button onClick={() => setDebug(!debug)}>
        <Emoji label="Debugging" emoji={debug ? "🦋" : "🐛"} />
      </Button>
    </div>
  )
}

export default Controls
