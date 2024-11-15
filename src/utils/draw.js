import RgbQuant from "rgbquant"

import { colorToNumber, numberToColor } from "./color"

const getResizedDimensions = ({
  videoWidth,
  videoHeight,
  maxWidth,
  maxHeight,
}) => {
  const videoAR = videoWidth / videoHeight

  const width = Math.max(maxWidth, Math.floor(maxHeight * videoAR))
  const height = Math.max(maxHeight, Math.floor(maxWidth / videoAR))

  let offsetX = 0
  let offsetY = 0

  if (width > maxWidth) {
    offsetX = (width - maxWidth) / 2
  } else {
    offsetY = (height - maxHeight) / 2
  }

  return { width, height, offsetX, offsetY }
}

// TODO: OOP? palette.quantize(imageData) would be nice...
const getQuantizedImage = (imageData, palette) => {
  const paletteColors = Object.keys(palette).map(numberToColor)

  const quant = new RgbQuant({
    palette: paletteColors,
    colors: paletteColors.length,
  })

  return quant.reduce(imageData)
}

const drawVideo = (
  ctx,
  src,
  { cropOffsetX, cropOffsetY, filter, resizeHeight, resizeWidth },
) => {
  const resizeCanvas = document.createElement("canvas")
  const resizeCtx = resizeCanvas.getContext("2d")

  // resize video
  // TODO: fix scaling issue? (seems like this won't scale up right.......)
  resizeCtx.drawImage(src, 0, 0, resizeWidth, resizeHeight)

  // Apply filters to video
  ctx.filter = filter

  // Crop video
  ctx.drawImage(
    resizeCtx.canvas,
    cropOffsetX,
    cropOffsetY,
    ctx.canvas.width,
    ctx.canvas.height,
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

  const quantizedImage = getQuantizedImage(imageData, palette)

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.font = `${fontSize * 2}px sans-serif`
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
    const emoji = palette[colorToNumber(r, g, b)]

    // draw the emoji
    ctx.fillText(emoji, nextX, nextY)

    // colors-only/debugging mode
    // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    // ctx.fillRect(nextX, nextY, 16, 16)

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
    paletteColors,
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
  const videoCtx = videoCanvas.getContext("2d")

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
      paletteColors,
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
