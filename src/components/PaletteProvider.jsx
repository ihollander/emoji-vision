import { useCallback, useEffect } from "react"

import { useLocalStorage } from "../hooks"
import { PaletteContext } from "../hooks/usePalette"
import Palette, { DEFAULT_EMOJI_LIST } from "../utils/palette"

const PaletteProvider = ({ children }) => {
  const [emojiColorMapping, setEmojiColorMapping] = useLocalStorage(
    "emojiColorMapping",
    null,
  )

  const updatePalette = useCallback(
    (emoji) => {
      Palette.build(emoji || DEFAULT_EMOJI_LIST).then((palette) => {
        setEmojiColorMapping(palette.emojiColorMapping)
      })
    },
    [setEmojiColorMapping],
  )

  useEffect(() => {
    if (!emojiColorMapping) {
      Palette.build(DEFAULT_EMOJI_LIST).then((palette) => {
        setEmojiColorMapping(palette.emojiColorMapping)
      })
    }
  }, [emojiColorMapping, setEmojiColorMapping])

  const palette = emojiColorMapping ? new Palette(emojiColorMapping) : null

  return (
    <PaletteContext.Provider value={{ palette, updatePalette }}>
      {children}
    </PaletteContext.Provider>
  )
}

export default PaletteProvider
