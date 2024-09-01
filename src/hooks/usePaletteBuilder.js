import { useState, useEffect } from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import { endpointSymbol } from "vite-plugin-comlink/symbol";

import { useLocalStorage } from './useLocalStorage'
import * as paletteStatus from '../constants/paletteBuilder'
import { createPalette } from '../utils/color'
import { paletteWorker } from '../workers'

const splitter = new GraphemeSplitter()

// TODO: config options
// transparency threshold?
// color analysis type?
export const usePaletteBuilder = emojis => {
  const [status, setStatus] = useState(paletteStatus.PENDING)
  const [palette, setPalette] = useLocalStorage('palette', null)
  const [paletteColors, setPaletteColors] = useLocalStorage('paletteColors', [])

  useEffect(() => {

    if (emojis && emojis.length) {
      setStatus(paletteStatus.PENDING)
      const emojiArray = splitter.splitGraphemes(emojis)

      // fallback for no offscreen canvas
      if (window.OffscreenCanvas === undefined) {
        const canvas = document.createElement("canvas")
        canvas.width = 16
        canvas.height = 16

        const { palette, paletteColors } = createPalette(canvas, emojiArray)

        setPalette(palette)
        setPaletteColors(paletteColors)

      } else {
        paletteWorker.buildPalette(emojiArray)
          .then(({ palette, paletteColors }) => {
            setPalette(palette)
            setPaletteColors(paletteColors)
            setStatus(paletteStatus.READY)
            paletteWorker[endpointSymbol].terminate()
          })
      }
    }
  }, [emojis, setPalette, setPaletteColors])

  return { palette, paletteColors, status }
}
