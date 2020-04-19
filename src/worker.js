import RgbQuant from 'rgbquant'
import { numberToColor } from './utils/color'

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
