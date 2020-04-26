import React, { useRef, useEffect } from 'react'
import { CanvasContainer } from './style'
import { colorToNumber } from '../../utils/color'
import { useDeviceDimensions, useUserMedia, usePixelatedVideo } from '../../hooks'
import * as userMediaStatus from '../../constants/userMedia'

const EmojiVision = ({
  canvasRef,
  palette,
  paletteColors,
  fontSize,
  brightness,
  saturate,
  contrast,
  facingMode,
  debug
}) => {

  const { orientation, screenWidth, screenHeight } = useDeviceDimensions()
  const deviceAspectRatio = screenWidth / screenHeight

  // debug
  const fpsRef = useRef()
  const lastCalledTimeRef = useRef()

  const { status: mediaStatus, mediaStream, activeCamera } = useUserMedia(orientation, facingMode)

  const { canvasWidth: pixelatedCanvasWidth, canvasHeight: pixelatedCanvasHeight, imageData } = usePixelatedVideo({ fontSize, mediaStream, paletteColors, brightness, saturate, contrast })

  const emojiCanvasWidth = pixelatedCanvasWidth * fontSize
  const emojiCanvasHeight = pixelatedCanvasHeight * fontSize

  // setup canvas
  useEffect(() => {
    if (canvasRef.current && emojiCanvasWidth && emojiCanvasHeight) {
      canvasRef.current.width = emojiCanvasWidth * 2
      canvasRef.current.height = emojiCanvasHeight * 2
    }
  }, [canvasRef, emojiCanvasWidth, emojiCanvasHeight])

  // // take new imageData and draw emojis
  useEffect(() => {
    if (canvasRef.current && imageData && mediaStatus === userMediaStatus.READY) {
      // setup context
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.font = `${fontSize * 2}px sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "top"

      // mirror if the camera is facing user
      ctx.save()
      if (facingMode === "user") {
        ctx.translate(ctx.canvas.width, 0)
        ctx.scale(-1, 1)
      }

      // position data
      let nextX = 0
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

        // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        // ctx.fillRect(nextX, nextY, 16, 16)

        // offset next position
        nextX += fontSize * 2
        if (nextX >= ctx.canvas.width) {
          nextY += fontSize * 2
          nextX = 0
        }
      }

      // in case canvas was mirrored, restore (so we can draw debug info correctly)
      ctx.restore()
    }
  }, [canvasRef, facingMode, fontSize, imageData, mediaStatus, palette])

  // debug
  useEffect(() => {
    if (canvasRef.current && debug && mediaStatus === userMediaStatus.READY) {
      const ctx = canvasRef.current.getContext('2d')

      const drawStrokedText = (text, x, y) => {
        ctx.font = `bold 24px sans-serif`
        ctx.textAlign = "left"
        ctx.fillStyle = `rgb(255,0,0)`
        ctx.fillText(text, x, y)
        ctx.strokeStyle = `rgb(255,255,255)`
        ctx.strokeText(text, x, y)
      }

      const drawFilters = filters => {
        Object.keys(filters).forEach((filter, index) => {
          drawStrokedText(`${filter}: ${filters[filter]}`, 20, 100 + (index * 25))
        })
      }

      // calculate fps
      if (!lastCalledTimeRef.current) {
        lastCalledTimeRef.current = performance.now()
        fpsRef.current = 0
      } else {
        let delta = (performance.now() - lastCalledTimeRef.current)
        fpsRef.current = 1000 / delta
        lastCalledTimeRef.current = performance.now()
      }

      const fps = fpsRef.current.toFixed(2)
      drawFilters({ fps, screenWidth, screenHeight, pixelatedCanvasWidth, pixelatedCanvasHeight, emojiCanvasWidth, emojiCanvasHeight, deviceAspectRatio, contrast, brightness, saturate, orientation, facingMode, activeCamera })
    }
  }, [canvasRef, debug, imageData, screenWidth, screenHeight, pixelatedCanvasWidth, pixelatedCanvasHeight, emojiCanvasWidth, emojiCanvasHeight, deviceAspectRatio, activeCamera, facingMode, contrast, brightness, saturate, orientation, mediaStatus])

  return (
    <CanvasContainer>
      <canvas ref={canvasRef} />
    </CanvasContainer>
  )
}

export default EmojiVision