import { FastAverageColor } from "fast-average-color"
import quantize from "quantize"

export const colorToNumber = (r, g, b) => (r << 16) + (g << 8) + b

export const numberToColor = (number) => {
  if (typeof number === "string") {
    number = parseInt(number, 10)
  }

  return [
    (number & 0xff0000) >> 16,
    (number & 0x00ff00) >> 8,
    number & 0x0000ff,
  ]
}

export const analyzePixels = (imageData, { algorithm = "quantized" } = {}) => {
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

// takes an emoji array, draws each emoji to canvas, and analyses average color
// returns a mapping of emoji and the on corresponding average color value
export const createPalette = (canvas, emojiArray) => {
  const ctx = canvas.getContext("2d")
  ctx.font = "15px monospace"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  return emojiArray.reduce((palette, emoji) => {
    ctx.clearRect(0, 0, 16, 16)

    // draw emoji
    ctx.fillText(emoji, 8, 10)

    const { data } = ctx.getImageData(0, 0, 16, 16)

    // get RGB and transparency values
    const pixelData = analyzePixels(data)

    if (pixelData !== null) {
      const [r, g, b] = pixelData

      // set palette color
      const colorInt = colorToNumber(r, g, b)
      palette[colorInt] = emoji
    }

    return palette
  }, {})
}
