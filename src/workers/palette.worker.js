import { createPalette } from "../utils/color"

// takes an emoji array, draws each emoji to canvas, and analyses average color
// returns a palette array ([r,g,b],[r,g,b]) for quantization
// and an object for easy lookup of emoji based on corresponding color value
export const buildPalette = (emojiArray) => {
  const canvas = new OffscreenCanvas(16, 16)

  return createPalette(canvas, emojiArray)
}
