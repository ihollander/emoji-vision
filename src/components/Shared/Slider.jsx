import * as RadixSlider from "@radix-ui/react-slider"
import { forwardRef } from "react"

import Emoji from "../Shared/Emoji"

const Slider = ({ emoji, label, value, onChange, min = 0.0, max = 1.0 }) => {
  const step = (max - min) / 100

  return (
    <RadixSlider.Root
      className="relative flex w-full touch-none select-none items-center py-4"
      min={min}
      max={max}
      onValueChange={(value) => onChange(value[0])}
      step={step}
      value={[value]}
    >
      <RadixSlider.Track className="relative h-3 grow rounded bg-white">
        <RadixSlider.Range className="absolute h-full rounded bg-black" />
      </RadixSlider.Track>
      <RadixSlider.Thumb asChild>
        <Thumb>
          <Emoji emoji={emoji} label={label} />
        </Thumb>
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  )
}

const Thumb = forwardRef(function Thumb(props, forwardedRef) {
  return (
    <div
      className="block flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl shadow-md outline-2 hover:shadow-lg focus:outline"
      {...props}
      ref={forwardedRef}
    />
  )
})

export default Slider
