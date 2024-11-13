import { useEffect, useRef } from "react"

import * as userMediaStatus from "../constants/userMedia"
import {
  useDeviceDimensions,
  usePaletteBuilder,
  usePixelatedVideo,
  useUserMedia,
} from "../hooks"
import useControls from "../hooks/useControls"
import useWindowSize from "../hooks/useWindowSize"
import { colorToNumber } from "../utils/color"

const EmojiVision = ({ canvasRef }) => {
  const { fontSize, brightness, saturate, contrast, facingMode, debug } =
    useControls()
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // emoji array used to build palette
  const { palette, paletteColors } = usePaletteBuilder()

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

  // setup canvas
  useEffect(() => {
    if (canvasRef.current && windowWidth > 0 && windowHeight > 0) {
      canvasRef.current.width = windowWidth * 2
      canvasRef.current.height = windowHeight * 2
    }
  }, [canvasRef, windowWidth, windowHeight, fontSize])

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
        windowWidth,
        windowHeight,
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
    windowHeight,
    windowWidth,
    facingMode,
    mediaStatus,
    orientation,
    pixelatedCanvasHeight,
    pixelatedCanvasWidth,
    saturate,
    screenHeight,
    screenWidth,
  ])

  return <canvas className="h-screen w-screen bg-black" ref={canvasRef} />
}

export default EmojiVision
