import RgbQuant from 'rgbquant'
import { analyzePixels, colorToNumber, numberToColor } from './utils/color'

export const normalizePixelData = (pixelData, palette) => {
  const paletteColors = Object.keys(palette).map(key => numberToColor(key))
  if (paletteColors.length) {
    const quant = new RgbQuant({
      palette: paletteColors,
      colors: paletteColors.length
    })
    pixelData = quant.reduce(pixelData)
  }
  return pixelData
}

export const buildPalette = emojiArray => {
  const palette = {}
  const paletteColors = []

  const canvas = new OffscreenCanvas(16, 16)
  const ctx = canvas.getContext('2d')

  ctx.font = "16px monospace"
  ctx.textAlign = "top"
  ctx.textBaseline = "left"

  emojiArray.forEach(emoji => {
    ctx.clearRect(0, 0, 16, 16)

    // draw emoji
    ctx.fillText(emoji, 0, 0)

    const { data } = ctx.getImageData(0, 0, 16, 16)

    // get RGB and transparency values
    const analyzedData = analyzePixels(data)

    if (analyzedData.dominant !== null) {
      const [r, g, b] = analyzedData.dominant

      // set palette color
      const colorInt = colorToNumber(r, g, b)
      palette[colorInt] = emoji
      paletteColors.push([r, g, b])
    }
  })

  return { palette, paletteColors }
}