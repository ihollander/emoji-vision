import { analyzePixels, colorToNumber } from '../utils/color'

// takes an emoji array, draws each emoji to canvas, and analyses average color
// returns a palette array ([r,g,b],[r,g,b]) for quantization 
// and an object for easy lookup of emoji based on corresponding color value
export const buildPalette = emojiArray => {
  const palette = {}
  const paletteColors = []

  const canvas = new OffscreenCanvas(16, 16)
  const ctx = canvas.getContext('2d')

  ctx.font = "15px monospace"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  emojiArray.forEach(emoji => {
    ctx.clearRect(0, 0, 16, 16)

    // draw emoji
    ctx.fillText(emoji, 8, 10)

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