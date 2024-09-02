import { useEffect, useRef } from "react"

import * as userMediaStatus from "../constants/userMedia"
import { useDeviceDimensions, usePixelatedVideo, useUserMedia } from "../hooks"
import { colorToNumber } from "../utils/color"

const EmojiVision = ({
  canvasRef,
  palette,
  paletteColors,
  fontSize,
  brightness,
  saturate,
  contrast,
  facingMode,
  debug,
}) => {
  const { orientation, screenWidth, screenHeight } = useDeviceDimensions()
  const deviceAspectRatio = screenWidth / screenHeight

  // debug
  const fpsRef = useRef()
  const lastCalledTimeRef = useRef()

  const {
    status: mediaStatus,
    mediaStream,
    activeCamera,
  } = useUserMedia({ orientation, facingMode })

  const {
    canvasWidth: pixelatedCanvasWidth,
    canvasHeight: pixelatedCanvasHeight,
    imageData,
  } = usePixelatedVideo({
    fontSize,
    mediaStream,
    paletteColors,
    brightness,
    saturate,
    contrast,
  })

  const emojiCanvasWidth = pixelatedCanvasWidth * fontSize * 2
  const emojiCanvasHeight = pixelatedCanvasHeight * fontSize * 2

  // setup canvas
  useEffect(() => {
    if (canvasRef.current && emojiCanvasWidth && emojiCanvasHeight) {
      canvasRef.current.width = emojiCanvasWidth
      canvasRef.current.height = emojiCanvasHeight
    }
  }, [canvasRef, emojiCanvasWidth, emojiCanvasHeight])

  // // take new imageData and draw emojis
  useEffect(() => {
    if (
      canvasRef.current &&
      imageData &&
      mediaStatus === userMediaStatus.READY
    ) {
      // setup context
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.font = `${fontSize * 2}px sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "top"

      // position data
      const offset = fontSize * 2
      const offsetX = facingMode === "user" ? -offset : offset
      const startX = facingMode === "user" ? ctx.canvas.width - offset : 0
      let nextX = startX
      let nextY = 0

      // iterate thru pixelData
      for (let i = 0; i < imageData.length; i += 4) {
        // read RGB pixels from imageData
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]

        // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        // ctx.fillRect(nextX, nextY, 16, 16)

        // find the emoji
        const emoji = palette[colorToNumber(r, g, b)]

        // draw the emoji
        ctx.fillText(emoji, nextX, nextY)

        // offset next position
        nextX += offsetX
        if (nextX < 0 || nextX >= ctx.canvas.width) {
          nextY += offset
          nextX = startX
        }
      }
    }
  }, [canvasRef, facingMode, fontSize, imageData, mediaStatus, palette])

  // debug
  useEffect(() => {
    if (canvasRef.current && debug && mediaStatus === userMediaStatus.READY) {
      const ctx = canvasRef.current.getContext("2d")

      const drawStrokedText = (text, x, y) => {
        ctx.font = `bold 48px sans-serif`
        ctx.textAlign = "left"
        ctx.fillStyle = `rgb(255,0,0)`
        ctx.fillText(text, x, y)
        ctx.strokeStyle = `rgb(255,255,255)`
        ctx.strokeText(text, x, y)
      }

      const drawFilters = (filters) => {
        Object.keys(filters).forEach((filter, index) => {
          drawStrokedText(`${filter}: ${filters[filter]}`, 20, 100 + index * 50)
        })
      }

      // calculate fps
      if (!lastCalledTimeRef.current) {
        lastCalledTimeRef.current = performance.now()
        fpsRef.current = 0
      } else {
        let delta = performance.now() - lastCalledTimeRef.current
        fpsRef.current = 1000 / delta
        lastCalledTimeRef.current = performance.now()
      }

      const fps = fpsRef.current.toFixed(2)
      drawFilters({
        fps,
        screenWidth,
        screenHeight,
        pixelatedCanvasWidth,
        pixelatedCanvasHeight,
        emojiCanvasWidth,
        emojiCanvasHeight,
        deviceAspectRatio,
        contrast,
        brightness,
        saturate,
        orientation,
        facingMode,
        activeCamera,
      })
    }
  }, [
    imageData,
    activeCamera,
    brightness,
    canvasRef,
    contrast,
    debug,
    deviceAspectRatio,
    emojiCanvasHeight,
    emojiCanvasWidth,
    facingMode,
    mediaStatus,
    orientation,
    pixelatedCanvasHeight,
    pixelatedCanvasWidth,
    saturate,
    screenHeight,
    screenWidth,
  ])

  return (
    <main className="flex items-center p-4">
      <div className="max-w-7xl mx-auto">
        <canvas
          className="w-full max-h-[calc(100vh-6.5rem)] bg-white"
          ref={canvasRef}
        />
      </div>
    </main>
  )
}

export default EmojiVision
