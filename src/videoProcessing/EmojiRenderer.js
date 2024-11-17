import { EMOJI_FONT_FAMILY } from "../constants/font"

export default class EmojiRenderer {
  constructor({
    facingMode,
    fontSize,
    palette,
    pixelMode,
    pixelVideoWidth,
    pixelVideoHeight,
  }) {
    this.facingMode = facingMode
    this.fontSize = fontSize * 2
    this.palette = palette
    this.pixelMode = pixelMode
    this.pixelVideoWidth = pixelVideoWidth
    this.pixelVideoHeight = pixelVideoHeight
  }

  process(ctx) {
    // get cropped/pixelated video image
    const imageData = ctx.getImageData(
      0,
      0,
      this.pixelVideoWidth,
      this.pixelVideoHeight,
    ).data

    // constrain video pixels to palette colors
    const quantizedImage = this.palette.quantize(imageData)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.font = `${this.fontSize - 1}px ${EMOJI_FONT_FAMILY}`
    ctx.textAlign = "left"
    ctx.textBaseline = "top"

    let nextX = 0
    let nextY = 0

    // replace each pixel with emoji
    for (let i = 0; i < quantizedImage.length; i += 4) {
      // read RGB pixels from imageData
      const r = quantizedImage[i]
      const g = quantizedImage[i + 1]
      const b = quantizedImage[i + 2]

      if (this.pixelMode) {
        // fill background with computed emoji color
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(nextX, nextY, this.fontSize, this.fontSize)
      } else {
        // draw emoji
        const emoji = this.palette.emojiForRgbColor(r, g, b)
        ctx.fillText(emoji, nextX, nextY)
      }

      // offset next position
      nextX += this.fontSize
      if (nextX + this.fontSize > ctx.canvas.width) {
        nextY += this.fontSize
        nextX = 0
      }
    }
  }
}
