import RgbQuant from "rgbquant"
import { endpointSymbol } from "vite-plugin-comlink/symbol"

import emojiArray from "../emoji.json"
import { colorToNumber, numberToColor } from "./color"
import EmojiColorMapper from "./EmojiColorMapper"

// Stores mappings of color -> emoji
export default class Palette {
  static defaultEmojiList = emojiArray.slice(0, 500).join("")

  static async build(emoji, { forceOnscreen = false } = {}) {
    if (forceOnscreen || !("OffscreenCanvas" in window)) {
      const canvas = document.createElement("canvas")
      canvas.width = EmojiColorMapper.canvasSize
      canvas.height = EmojiColorMapper.canvasSize
      const emojiColorMapping = new EmojiColorMapper(canvas, emoji).call()
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
        const emojiColorMapping =
          await paletteWorker.buildEmojiColorMappingOffscreen(emoji)
        return new Palette(emojiColorMapping)
      } catch (err) {
        console.error(err)
        return Palette.build(emoji, { forceOnscreen: true })
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
    const colorNumber = colorToNumber(r, g, b)
    return this.emojiColorMapping[colorNumber]
  }
}
