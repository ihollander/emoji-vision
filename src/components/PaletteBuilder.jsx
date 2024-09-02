import { useEffect, useState } from "react"

const PaletteBuilder = ({ emoji, setEmoji }) => {
  const [value, setValue] = useState(emoji)

  useEffect(() => {
    // only set new values when component unmounts
    return () => {
      setEmoji(value)
    }
  }, [emoji, setEmoji, value])

  return (
    <textarea
      className="w-full h-[28rem] bg-white text-lg resize-none"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default PaletteBuilder
