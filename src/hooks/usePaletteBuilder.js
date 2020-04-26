import { useState, useEffect } from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import * as paletteStatus from '../constants/paletteBuilder'

// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../worker'

const splitter = new GraphemeSplitter()
const workerInstance = worker()

// TODO: config options
// transparency threshold?
// color analysis type?
export const usePaletteBuilder = emojis => {
  const [status, setStatus] = useState(paletteStatus.PENDING)
  const [palette, setPalette] = useState(null)
  const [paletteColors, setPaletteColors] = useState([])

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
  }, [emojis])

  return { palette, paletteColors, status }
}
