import GraphemeSplitter from "grapheme-splitter"
import { useCallback, useEffect } from "react"
import { endpointSymbol } from "vite-plugin-comlink/symbol"

import emojiArray from "../emoji.json"
import { useLocalStorage } from "../hooks"
import { PaletteBuilderContext } from "../hooks/usePaletteBuilder"
import { createPalette } from "../utils/color"

const splitter = new GraphemeSplitter()

const lessEmoji = emojiArray.slice(0, 500).join("")

const buildPalette = async (emojiArray, { buildOnscreen = false } = {}) => {
  if (buildOnscreen || window.OffscreenCanvas === undefined) {
    const canvas = document.createElement("canvas")
    canvas.width = 16
    canvas.height = 16

    return createPalette(canvas, emojiArray)
  } else {
    // Trailing comma after new URL() breaks the regex that vite-plugin-comlink uses to identify this code,
    // so we need prettier-ignore

    // prettier-ignore
    // eslint-disable-next-line no-undef
    const paletteWorker = new ComlinkWorker(
      new URL('../workers/palette.worker', import.meta.url)
    )

    try {
      return await paletteWorker.buildPaletteOffscreen(emojiArray)
    } catch {
      return buildPalette(emojiArray, { buildOnscreen: true })
    } finally {
      paletteWorker[endpointSymbol].terminate()
    }
  }
}

const PaletteBuilderProvider = ({ children }) => {
  const [palette, setPalette] = useLocalStorage("palette", null)

  const updatePalette = useCallback(
    (emojiString) => {
      if (emojiString.length > 0) {
        const emojiArray = splitter.splitGraphemes(emojiString)
        buildPalette(emojiArray).then(setPalette)
      } else {
        updatePalette(lessEmoji)
      }
    },
    [setPalette],
  )

  // build default palette
  useEffect(() => {
    if (!palette) {
      updatePalette(lessEmoji)
    }
  }, [palette, updatePalette])

  const emoji = palette ? Object.values(palette).join("") : ""

  return (
    <PaletteBuilderContext.Provider value={{ emoji, palette, updatePalette }}>
      {children}
    </PaletteBuilderContext.Provider>
  )
}

export default PaletteBuilderProvider
