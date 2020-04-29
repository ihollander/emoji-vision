import { useState, useEffect } from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import * as paletteStatus from '../constants/paletteBuilder'
import { useLocalStorage } from './useLocalStorage'
import { createPalette } from '../utils/color'

// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../workers/palette.worker'

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
        const workerInstance = worker()
        workerInstance.buildPalette(emojiArray)
          .then(({ palette, paletteColors }) => {
            setPalette(palette)
            setPaletteColors(paletteColors)
            setStatus(paletteStatus.READY)

            workerInstance.terminate()
          })
      }


    }
  }, [emojis, setPalette, setPaletteColors])

  return { palette, paletteColors, status }
}
