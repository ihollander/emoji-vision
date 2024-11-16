import EmojiColorMapper from "../utils/EmojiColorMapper"

export const buildEmojiColorMappingOffscreen = (emoji) => {
  const canvas = new OffscreenCanvas(
    EmojiColorMapper.canvasSize,
    EmojiColorMapper.canvasSize,
  )
  return new EmojiColorMapper(canvas, emoji).call()
}
