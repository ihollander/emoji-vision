import RgbQuant from "rgbquant"

import { colorToNumber } from "./color"

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

const getQuantizedPixelData = (ctx, paletteColors) => {
  const rawPixelData = ctx.getImageData(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height,
  ).data

  const quant = new RgbQuant({
    palette: paletteColors,
    colors: paletteColors.length,
  })

  return quant.reduce(rawPixelData)
}

const drawVideo = (ctx, src, { filter }) => {
  const resizeCanvas = document.createElement("canvas")
  const resizeCtx = resizeCanvas.getContext("2d")

  const {
    width: resizeWidth,
    height: resizeHeight,
    offsetX: cropOffsetX,
    offsetY: cropOffsetY,
  } = getResizedDimensions({
    videoWidth: src.videoWidth,
    videoHeight: src.videoHeight,
    maxWidth: ctx.canvas.width,
    maxHeight: ctx.canvas.height,
  })

  // resize video
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

const drawEmojiPixels = (
  ctx,
  src,
  { facingMode, fontSize, palette, paletteColors },
) => {
  const quantizedPixelData = getQuantizedPixelData(src, paletteColors)

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.font = `${fontSize * 2}px sans-serif`
  ctx.textAlign = "left"
  ctx.textBaseline = "top"

  const offset = fontSize * 2
  const offsetX = facingMode === "user" ? -offset : offset
  const startX = facingMode === "user" ? ctx.canvas.width - offset : 0
  let nextX = startX
  let nextY = 0

  for (let i = 0; i < quantizedPixelData.length; i += 4) {
    // read RGB pixels from imageData
    const r = quantizedPixelData[i]
    const g = quantizedPixelData[i + 1]
    const b = quantizedPixelData[i + 2]

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
    deviceAspectRatio,
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
  const videoCanvas = document.createElement("canvas")
  const videoCtx = videoCanvas.getContext("2d")

  videoCanvas.width = Math.floor(windowWidth / fontSize)
  videoCanvas.height = Math.floor(windowHeight / fontSize)

  // build filters
  const filter = Object.entries({ brightness, contrast, saturate })
    .map(([key, value]) => `${key}(${value || 1.0})`)
    .join(" ")

  // debug only
  let fpsCounter = performance.now()

  const render = () => {
    // Setup next loop
    rafId = requestAnimationFrame(render)

    drawVideo(videoCtx, video, { filter })

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
        deviceAspectRatio,
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
