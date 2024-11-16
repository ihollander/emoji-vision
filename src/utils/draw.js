import { EMOJI_FONT_FAMILY } from "../constants/font"

const getResizedDimensions = ({
  videoWidth,
  videoHeight,
  maxWidth,
  maxHeight,
}) => {
  const videoAR = videoWidth / videoHeight

  const width = Math.floor(maxHeight * videoAR)
  const height = Math.floor(maxWidth / videoAR)

  const offsetX = width > maxWidth ? (width - maxWidth) / 2 : 0
  const offsetY = height > maxHeight ? (height - maxHeight) / 2 : 0

  return { width, height, offsetX, offsetY }
}

const drawVideo = (
  ctx,
  src,
  { cropOffsetX, cropOffsetY, filter, resizeHeight, resizeWidth },
) => {
  const resizeCanvas = document.createElement("canvas")
  resizeCanvas.width = resizeWidth
  resizeCanvas.height = resizeHeight

  const resizeCtx = resizeCanvas.getContext("2d")

  // resize video
  resizeCtx.drawImage(src, 0, 0, resizeWidth, resizeHeight)

  // Apply filters to video
  ctx.filter = filter

  // Crop video
  ctx.drawImage(
    resizeCanvas,
    cropOffsetX,
    cropOffsetY,
    resizeWidth - cropOffsetX * 2,
    resizeHeight - cropOffsetY * 2,
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height,
  )
}

const drawEmojiPixels = (ctx, src, { facingMode, fontSize, palette }) => {
  const imageData = src.getImageData(
    0,
    0,
    src.canvas.width,
    src.canvas.height,
  ).data

  const quantizedImage = palette.quantize(imageData)

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.font = `${fontSize * 2}px ${EMOJI_FONT_FAMILY}`
  ctx.textAlign = "left"
  ctx.textBaseline = "top"

  const offset = fontSize * 2
  const offsetX = facingMode === "user" ? -offset : offset
  const startX = facingMode === "user" ? ctx.canvas.width - offset : 0
  let nextX = startX
  let nextY = 0

  for (let i = 0; i < quantizedImage.length; i += 4) {
    // read RGB pixels from imageData
    const r = quantizedImage[i]
    const g = quantizedImage[i + 1]
    const b = quantizedImage[i + 2]

    // find the emoji
    const emoji = palette.emojiForRgbColor(r, g, b)

    // draw the emoji
    ctx.fillText(emoji, nextX, nextY)

    // colors-only/debugging mode
    // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    // ctx.fillRect(nextX, nextY, offset, offset)

    // offset next position
    nextX += offsetX
    if (nextX < 0 || nextX >= ctx.canvas.width) {
      nextY += offset
      nextX = startX
    }
  }
}

const drawDebugInfo = (ctx, filters) => {
  Object.entries(filters).forEach(([key, value], index) => {
    const text = `${key}: ${value}`
    const x = 20
    const y = 100 + index * 50

    ctx.font = `bold 48px sans-serif`
    ctx.textAlign = "left"
    ctx.fillStyle = `rgb(255,0,0)`
    ctx.fillText(text, x, y)
    ctx.strokeStyle = `rgb(255,255,255)`
    ctx.strokeText(text, x, y)
  })
}

const drawEmojiVideo = (
  ctx,
  video,
  {
    activeCamera,
    brightness,
    contrast,
    debug,
    facingMode,
    fontSize,
    orientation,
    palette,
    saturate,
    windowHeight,
    windowWidth,
  },
) => {
  // requestAnimationFrame tracker
  let rafId = null

  // setup main canvas
  ctx.canvas.width = windowWidth * 2
  ctx.canvas.height = windowHeight * 2

  // setup extra canvases
  // TODO: do these offscreen if possible???
  const videoCanvas = document.createElement("canvas")
  const videoCtx = videoCanvas.getContext("2d", { willReadFrequently: true })

  videoCanvas.width = Math.floor(windowWidth / fontSize)
  videoCanvas.height = Math.floor(windowHeight / fontSize)

  const {
    width: resizeWidth,
    height: resizeHeight,
    offsetX: cropOffsetX,
    offsetY: cropOffsetY,
  } = getResizedDimensions({
    videoWidth: video.videoWidth,
    videoHeight: video.videoHeight,
    maxWidth: videoCanvas.width,
    maxHeight: videoCanvas.height,
  })

  // build filters
  const filter = Object.entries({ brightness, contrast, saturate })
    .map(([key, value]) => `${key}(${value || 1.0})`)
    .join(" ")

  // debug only
  let fpsCounter = performance.now()

  const render = () => {
    // Setup next loop
    rafId = requestAnimationFrame(render)

    drawVideo(videoCtx, video, {
      cropOffsetX,
      cropOffsetY,
      filter,
      resizeHeight,
      resizeWidth,
    })

    drawEmojiPixels(ctx, videoCtx, {
      facingMode,
      fontSize,
      palette,
    })

    if (debug) {
      drawDebugInfo(ctx, {
        fps: (1000 / (performance.now() - fpsCounter)).toFixed(2),
        activeCamera,
        brightness,
        contrast,
        fontSize,
        orientation,
        saturate,
        windowHeight,
        windowWidth,
        facingMode,
      })

      fpsCounter = performance.now()
    }
  }

  // start loop
  rafId = requestAnimationFrame(render)

  // return fn to cancel animation frame (dumb comment lol)
  return () => cancelAnimationFrame(rafId)
}

export default drawEmojiVideo
