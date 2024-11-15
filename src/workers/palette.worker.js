import { createPalette } from "../utils/color"

export const buildPaletteOffscreen = (emojiArray) => {
  const canvas = new OffscreenCanvas(16, 16)

  return createPalette(canvas, emojiArray)
}
