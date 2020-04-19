import React, { useState, useEffect, useRef } from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import { analyzePixels, colorToNumber } from '../utils/color'
import emoji from '../emoji.json'
import './PaletteBuilder.css'

const splitter = new GraphemeSplitter()
const lessEmoji = emoji.slice(0, 500).join("")

// TODO: config options
// transparency threshold
// color analysis type

const PaletteBuilder = ({ setPalette }) => {
  const [emojis, setEmojis] = useState(lessEmoji)

  const canvasRef = useRef()

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.clientWidth
      canvasRef.current.height = canvasRef.current.clientHeight

      const graphemes = splitter.splitGraphemes(emojis)

      if (canvasRef.current.height < 25 * Math.ceil(graphemes.length / 7)) {
        canvasRef.current.height = 25 * Math.ceil(graphemes.length / 7)
      }

      // context setup
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.font = "21px/25px monospace"
      ctx.textAlign = "left"
      ctx.textBaseline = "top"

      let nextX = 0
      let nextY = 0
      let newPalette = {}

      graphemes.forEach(emoji => {
        // get image data from canvas
        const { actualBoundingBoxLeft, actualBoundingBoxRight } = ctx.measureText(emoji)
        const width = actualBoundingBoxRight - actualBoundingBoxLeft

        if (width > 0) {
          if (nextX + width > canvasRef.current.width) {
            nextX = 0
            nextY += 25
          }

          // draw emoji
          ctx.fillText(emoji, nextX, nextY + 4)

          const { data } = ctx.getImageData(nextX, nextY, width, 25)

          // get RGB and transparency values
          const analyzedData = analyzePixels(data)

          const [r, g, b] = analyzedData.dominant
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(nextX, nextY, width, 25)

          // set palette color
          const colorInt = colorToNumber(r, g, b)
          newPalette[colorInt] = emoji

          nextX += width
        }
      })

      setPalette(newPalette)
    }
  }, [canvasRef, emojis, setPalette])

  return (
    <div className="palette-builder">
      <textarea
        value={emojis}
        onChange={e => setEmojis(e.target.value)}
      />
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
        />
      </div>
    </div>
  )
}

export default PaletteBuilder