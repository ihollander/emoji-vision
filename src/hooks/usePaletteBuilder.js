import { useState, useEffect } from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import * as paletteStatus from '../constants/paletteBuilder'
import { useLocalStorage } from './useLocalStorage'

// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../worker'

const splitter = new GraphemeSplitter()
const workerInstance = worker()

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

      workerInstance.buildPalette(emojiArray)
        .then(({ palette, paletteColors }) => {
          setPalette(palette)
          setPaletteColors(paletteColors)
          setStatus(paletteStatus.READY)
        })
    }
  }, [emojis, setPalette, setPaletteColors])

  return { palette, paletteColors, status }
}
