import { useCallback, useEffect } from "react"

import { useLocalStorage } from "../hooks"
import { PaletteContext } from "../hooks/usePalette"
import Palette from "../utils/Palette"

const PaletteProvider = ({ children }) => {
  const [emojiColorMapping, setEmojiColorMapping] = useLocalStorage(
    "emojiColorMapping",
    null,
  )

  const updatePalette = useCallback(
    (emoji) => {
      Palette.build(emoji || Palette.defaultEmojiList).then((palette) => {
        setEmojiColorMapping(palette.emojiColorMapping)
      })
    },
    [setEmojiColorMapping],
  )

  useEffect(() => {
    if (!emojiColorMapping) {
      Palette.build(Palette.defaultEmojiList).then((palette) => {
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
