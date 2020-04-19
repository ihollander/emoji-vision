import React, { useState, useEffect, useRef } from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import { analyzePixels, colorToNumber } from '../../utils/color'
import { Textarea } from './style'

import emoji from '../../emoji.json'
const lessEmoji = emoji.slice(0, 500).join("")

const splitter = new GraphemeSplitter()

// TODO: config options
// transparency threshold
// color analysis type

const PaletteBuilder = ({ setPalette }) => {
  const [emojis, setEmojis] = useState(lessEmoji)

  const canvasRef = useRef(document.createElement("canvas"))

  useEffect(() => {
    if (canvasRef.current && emojis) {
      canvasRef.current.width = 16
      canvasRef.current.height = 16

      const graphemes = splitter.splitGraphemes(emojis)

      // context setup
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      let newPalette = {}

      graphemes.forEach(emoji => {
        // draw emoji
        ctx.fillText(emoji, 0, 0)

        const { data } = ctx.getImageData(0, 0, 16, 16)

        // get RGB and transparency values
        const analyzedData = analyzePixels(data)

        const [r, g, b] = analyzedData.dominant

        // set palette color
        const colorInt = colorToNumber(r, g, b)
        newPalette[colorInt] = emoji
      })
      setPalette(newPalette)
    }
  }, [canvasRef, emojis, setPalette])

  return (
    <Textarea
      value={emojis}
      onChange={e => setEmojis(e.target.value)}
    />
  )
}

export default PaletteBuilder