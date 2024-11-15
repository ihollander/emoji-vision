import { useEffect, useRef } from "react"

import { usePaletteBuilder } from "../hooks"

const PaletteBuilder = () => {
  const { emoji, updatePalette } = usePaletteBuilder()
  const textareaRef = useRef()

  // only set new values when component unmounts
  // TODO: find a nicer way to do this...
  useEffect(() => {
    const { current } = textareaRef

    return () => updatePalette(current.value)
  }, [updatePalette])

  return (
    <textarea
      name="palette"
      autoComplete="false"
      className="h-[28rem] w-full resize-none bg-white text-lg"
      defaultValue={emoji}
      ref={textareaRef}
    />
  )
}

export default PaletteBuilder
