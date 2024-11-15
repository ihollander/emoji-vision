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
