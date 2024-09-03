import { useEffect, useRef } from "react"

import { usePaletteBuilder } from "../hooks"

const PaletteBuilder = () => {
  const { emoji, setEmoji } = usePaletteBuilder()
  const textareaRef = useRef()

  // only set new values when component unmounts
  useEffect(() => {
    const { current } = textareaRef

    return () => setEmoji(current.value)
  }, [setEmoji])

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
