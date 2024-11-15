import GraphemeSplitter from "grapheme-splitter"
import RgbQuant from "rgbquant"
import { endpointSymbol } from "vite-plugin-comlink/symbol"

import emojiArray from "../emoji.json"
import { analyzePixels, colorToNumber, numberToColor } from "./color"

const splitter = new GraphemeSplitter()

const EMOJI_CANVAS_SIZE = 16

export const DEFAULT_EMOJI_LIST = emojiArray.slice(0, 500).join("")

// takes an emoji array, draws each emoji to canvas, and analyses average color
// returns a mapping of emoji and the corresponding average color value
export const buildEmojiColorMapping = (canvas, emojiArray) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  ctx.font = "15px monospace"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  return emojiArray.reduce((emojiColorMapping, emoji) => {
    ctx.clearRect(0, 0, EMOJI_CANVAS_SIZE, EMOJI_CANVAS_SIZE)
    ctx.fillText(emoji, 8, 10)

    const pixelData = analyzePixels(
      ctx.getImageData(0, 0, EMOJI_CANVAS_SIZE, EMOJI_CANVAS_SIZE).data,
    )

    if (pixelData !== null) {
      const colorInt = colorToNumber(...pixelData.slice(0, 3))
      emojiColorMapping[colorInt] = emoji
    }

    return emojiColorMapping
  }, {})
}

export default class Palette {
  static async build(emoji, { offscreen = false } = {}) {
    const emojiArray = splitter.splitGraphemes(emoji)

    if (!offscreen || window.OffscreenCanvas === undefined) {
      const canvas = document.createElement("canvas")
      canvas.width = EMOJI_CANVAS_SIZE
      canvas.height = EMOJI_CANVAS_SIZE
      const emojiColorMapping = buildEmojiColorMapping(canvas, emojiArray)
      return new Palette(emojiColorMapping)
    } else {
      // Trailing comma after new URL() breaks the regex that vite-plugin-comlink uses to identify this code,
      // so we need prettier-ignore

      // prettier-ignore
      // eslint-disable-next-line no-undef
      const paletteWorker = new ComlinkWorker(
        new URL('../workers/palette.worker', import.meta.url)
      )

      try {
        const canvas = new OffscreenCanvas(EMOJI_CANVAS_SIZE, EMOJI_CANVAS_SIZE)
        const emojiColorMapping =
          await paletteWorker.buildEmojiColorMappingOffscreen(
            canvas,
            emojiArray,
          )
        return new Palette(emojiColorMapping)
      } catch {
        return Palette.build(emojiArray, { offscreen: false })
      } finally {
        paletteWorker[endpointSymbol].terminate()
      }
    }
  }

  constructor(emojiColorMapping) {
    this.emojiColorMapping = emojiColorMapping
  }

  get emoji() {
    return Object.values(this.emojiColorMapping).join("")
  }

  get rbgColors() {
    return Object.keys(this.emojiColorMapping).map(numberToColor)
  }

  quantize(image) {
    return new RgbQuant({
      palette: this.rbgColors,
      colors: this.rbgColors.length,
    }).reduce(image)
  }

  emojiForRgbColor(r, g, b) {
    return this.emojiColorMapping[colorToNumber(r, g, b)]
  }
}
