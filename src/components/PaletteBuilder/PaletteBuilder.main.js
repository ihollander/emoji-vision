import React from 'react'
import { Textarea } from './style'

const PaletteBuilder = ({ emoji, setEmoji }) => {
  return (
    <Textarea
      value={emoji}
      onChange={e => setEmoji(e.target.value)}
    />
  )
}

export default PaletteBuilder