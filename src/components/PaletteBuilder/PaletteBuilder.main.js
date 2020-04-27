import React, { useState, useEffect } from 'react'
import { Textarea } from './style'

const PaletteBuilder = ({ emoji, setEmoji }) => {
  const [value, setValue] = useState(emoji)

  useEffect(() => {
    // only set new values when component unmounts
    return () => {
      setEmoji(value)
    }
  }, [emoji, setEmoji, value])

  return (
    <Textarea
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

export default PaletteBuilder