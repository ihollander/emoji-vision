import GraphemeSplitter from "grapheme-splitter"
import { useEffect } from "react"
import { endpointSymbol } from "vite-plugin-comlink/symbol"

import emoji from "../emoji.json"
import { useLocalStorage } from "../hooks"
import { PaletteBuilderContext } from "../hooks/usePaletteBuilder"
import { createPalette } from "../utils/color"
import { paletteWorker } from "../workers"

const splitter = new GraphemeSplitter()

const lessEmoji = emoji.slice(0, 500).join("")

const PaletteBuilderProvider = ({ children }) => {
  const [emoji, setEmoji] = useLocalStorage("emojiList", lessEmoji)

  const [palette, setPalette] = useLocalStorage("palette", null)
  const [paletteColors, setPaletteColors] = useLocalStorage("paletteColors", [])

  useEffect(() => {
    if (emoji?.length > 0) {
      const emojiArray = splitter.splitGraphemes(emoji)

      // fallback for no offscreen canvas
      if (window.OffscreenCanvas === undefined) {
        const canvas = document.createElement("canvas")
        canvas.width = 16
        canvas.height = 16

        const { palette, paletteColors } = createPalette(canvas, emojiArray)

        setPalette(palette)
        setPaletteColors(paletteColors)
      } else {
        // TODO: this doesn't work :( never resolves...
        paletteWorker
          .buildPalette(emojiArray)
          .then(({ palette, paletteColors }) => {
            setPalette(palette)
            setPaletteColors(paletteColors)
            paletteWorker[endpointSymbol].terminate()
          })
          .catch((err) => console.log(err))
      }
    }
  }, [emoji, setPalette, setPaletteColors])

  return (
    <PaletteBuilderContext.Provider
      value={{ emoji, palette, paletteColors, setEmoji }}
    >
      {children}
    </PaletteBuilderContext.Provider>
  )
}

export default PaletteBuilderProvider
