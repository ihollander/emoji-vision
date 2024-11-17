import { FastAverageColor } from "fast-average-color"
import GraphemeSplitter from "grapheme-splitter"
import quantize from "quantize"

import { EMOJI_FONT_FAMILY } from "../constants/font"
import { colorToNumber } from "./color"

export default class EmojiColorMapper {
  static canvasSize = 16

  constructor(canvas, emoji) {
    this.canvas = canvas
    this.emoji = emoji
  }

  // draws each emoji to canvas and analyses average color
  // returns a mapping of emoji and the corresponding average color value
  call() {
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true })
    ctx.font = `15px ${EMOJI_FONT_FAMILY}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    return this.emojiArray.reduce((emojiColorMapping, emoji) => {
      ctx.clearRect(
        0,
        0,
        EmojiColorMapper.canvasSize,
        EmojiColorMapper.canvasSize,
      )
      ctx.fillText(emoji, 8, 10)

      const imageData = ctx.getImageData(
        0,
        0,
        EmojiColorMapper.canvasSize,
        EmojiColorMapper.canvasSize,
      ).data

      const pixelData = this.analyzePixels(imageData)

      if (pixelData !== null) {
        const [r, g, b] = pixelData
        const colorInt = colorToNumber(r, g, b)
        emojiColorMapping[colorInt] = emoji
      }

      return emojiColorMapping
    }, {})
  }

  analyzePixels(imageData, algorithm = "quantized") {
    switch (algorithm) {
      case "sqrt":
      case "simple":
      case "dominant":
        return new FastAverageColor()
          .getColorFromArray4(imageData, { algorithm })
          .slice(0, 3)
      case "quantized": {
        const pixels = []

        for (let i = 0, r, g, b, a; i < imageData.length; i += 4) {
          r = imageData[i]
          g = imageData[i + 1]
          b = imageData[i + 2]
          a = imageData[i + 3]

          // ignore if mostly transparent
          if (a >= 125) {
            pixels.push([r, g, b])
          }
        }

        const quantized = quantize(pixels, 2)
        return quantized ? quantized.palette()[0] : null
      }
    }
  }

  get emojiArray() {
    return new GraphemeSplitter().splitGraphemes(this.emoji)
  }
}
