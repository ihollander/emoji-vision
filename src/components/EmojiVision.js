import React, { useRef, useEffect } from 'react'
import { colorToNumber } from '../utils/color'
import { useDeviceDimensions, useUserMedia, usePixelatedVideo } from '../hooks'
import * as userMediaStatus from '../constants/userMedia'

const EmojiVision = ({
  palette,
  paletteColors,
  fontSize,
  filters,
  facingMode
}) => {

  const { orientation, screenWidth, screenHeight } = useDeviceDimensions()
  const deviceAspectRatio = screenWidth / screenHeight

  const requestedWidth = Math.min(Math.floor(screenWidth / fontSize), 100)
  const requestedHeight = requestedWidth / deviceAspectRatio

  const canvasRef = useRef()

  // debug
  const fpsRef = useRef()
  const lastCalledTimeRef = useRef()

  const requestedAspectRatio = requestedWidth / requestedHeight
  const { width, height, status: mediaStatus, mediaStream, activeCamera } = useUserMedia(requestedAspectRatio, requestedWidth, requestedHeight, facingMode)

  const videoAspectRatio = width / height

  const { imageData } = usePixelatedVideo({ mediaStream, width, height, paletteColors, filters })

  // setup canvas
  useEffect(() => {
    if (width && height) {
      canvasRef.current.width = width * fontSize
      canvasRef.current.height = height * fontSize
    }
  }, [width, height, fontSize])

  // take new imageData and draw emojis
  useEffect(() => {
    if (canvasRef.current && imageData && mediaStatus === userMediaStatus.READY) {
      // setup context
      const ctx = canvasRef.current.getContext('2d')
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // mirror if the camera is facing user
      ctx.save()
      if (facingMode === "user") {
        ctx.translate(ctx.canvas.width, 0)
        ctx.scale(-1, 1)
      }

      // iterate thru pixelData
      for (let i = 0; i < imageData.length; i += 4) {
        // use compressed canvas aspect ratio to get 2D coordinates from 1D pixel array
        const y = Math.floor((i / 4) / width) * fontSize
        const x = ((i / 4) % width) * fontSize

        // read RGB pixels from imageData
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]

        // find the emoji
        const emoji = palette[colorToNumber(r, g, b)]

        // draw the emoji
        ctx.fillText(emoji, x, y)
      }

      // in case canvas was mirrored, restore (so we can draw debug info correctly)
      ctx.restore()
    }
  }, [facingMode, fontSize, imageData, palette, width, mediaStatus])

  // debug / FPS
  // TODO: make toggleable (debug state)
  useEffect(() => {
    if (mediaStatus === userMediaStatus.READY) {
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
          drawStrokedText(`${filter}: ${filters[filter]}`, 20, 20 + (index * 25))
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

      const { contrast, brightness, saturate } = filters
      const fps = fpsRef.current.toFixed(2)
      drawFilters({ fps, screenWidth, screenHeight, width, height, deviceAspectRatio, requestedAspectRatio, videoAspectRatio, contrast, brightness, saturate, orientation, facingMode, activeCamera })
    }
  }, [imageData, screenWidth, screenHeight, width, height, deviceAspectRatio, requestedAspectRatio, videoAspectRatio, activeCamera, facingMode, filters, orientation, mediaStatus])

  // TODO: stylez
  return (
    <canvas ref={canvasRef} style={{ width: "100%" }} />
  )
}

export default EmojiVision