import quantize from 'quantize'
import FastAverageColor from 'fast-average-color'

export const colorToNumber = (r, g, b) => (r << 16) + (g << 8) + b

export const numberToColor = number => {
  if (typeof number === "string") {
    number = parseInt(number, 10)
  }

  return [
    (number & 0xff0000) >> 16,
    (number & 0x00ff00) >> 8,
    (number & 0x0000ff)
  ]
}

export const analyzePixels = imageData => {
  const fac = new FastAverageColor()
  const sqrt = fac.getColorFromArray4(imageData).slice(0, 3)
  const simple = fac.getColorFromArray4(imageData, { algorithm: "simple" }).slice(0, 3)
  const facDominant = fac.getColorFromArray4(imageData, { algorithm: "dominant" }).slice(0, 3)

  const pixels = []
  let transparentPixels = 0

  for (let i = 0, r, g, b, a; i < imageData.length; i += 4) {
    r = imageData[i]
    g = imageData[i + 1]
    b = imageData[i + 2]
    a = imageData[i + 3]

    // image opacity and whiteness
    if (a >= 125) {
      pixels.push([r, g, b])
    }
    if (a === 255) {
      transparentPixels++
    }
  }

  const [dominant] = quantize(pixels, 2).palette()
  const transparency = transparentPixels / pixels.length
  return { dominant, transparency, sqrt, facDominant, simple }
}
