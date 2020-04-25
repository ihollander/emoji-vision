import React, { useRef, useEffect } from 'react'
import { colorToNumber } from '../utils/color'
import { useUserMedia, usePixelatedVideo } from '../hooks'

const buildFilterString = filterObj => {
  return Object.keys(filterObj).map(filter => {
    return `${filter}(${filterObj[filter] || 1.0})`
  }).join(" ")
}

// debug
let lastCalledTime;
let fps;

const drawStrokedText = (ctx, text, x, y) => {
  ctx.font = `bold 24px sans-serif`
  ctx.textAlign = "left"
  ctx.fillStyle = `rgb(255,0,0)`
  ctx.fillText(text, x, y)
  ctx.strokeStyle = `rgb(255,255,255)`
  ctx.strokeText(text, x, y)
}

const drawFps = ctx => {
  if (!lastCalledTime) {
    lastCalledTime = performance.now()
    fps = 0
  } else {
    let delta = (performance.now() - lastCalledTime)
    fps = 1000 / delta
    lastCalledTime = performance.now()
    drawStrokedText(ctx, `FPS: ${fps.toFixed(2)}`, 20, 20)
  }
}
const drawFilters = (ctx, filters) => {
  Object.keys(filters).forEach((filter, index) => {
    drawStrokedText(ctx, `${filter}: ${filters[filter]}`, 20, 45 + (index * 25))
  })
}

// const constraints = {
//   video: {
//     width: { max: 80 },
//     height: { max: 60 }
//   }
// }

const EmojiVision = ({ palette, fontSize, facingMode, mirror, constraints, orientation, filters: { contrast, brightness, saturate } }) => {

  const filterString = buildFilterString({ contrast, brightness, saturate })

  const canvasRef = useRef()
  // move this up?
  // const { mediaStream } = useUserMedia(constraints)
  const { imageData, width, height, activeCamera, status } = usePixelatedVideo({ constraints, palette, filterString })

  useEffect(() => {
    if (canvasRef.current && imageData && palette) {

      const cWidth = width * fontSize
      const cHeight = height * fontSize
      // setup canvas

      canvasRef.current.width = cWidth
      canvasRef.current.height = cHeight
      const ctx = canvasRef.current.getContext('2d')
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.save()

      if (mirror) {
        ctx.translate(ctx.canvas.width, 0)
        ctx.scale(-1, 1)
      }

      // iterate thru pixelData
      for (let i = 0; i < imageData.length; i += 4) {
        // use compressed canvas aspect ratio to get 2D coordinates from 1D pixel array
        const y = Math.floor((i / 4) / (cWidth / fontSize)) * fontSize
        const x = ((i / 4) % (cWidth / fontSize)) * fontSize

        // read RGB pixels from imageData
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]

        // find the emoji
        const emoji = palette[colorToNumber(r, g, b)]
        ctx.fillText(emoji, x, y)

        // ctx.fillStyle = `rgb(${r},${g},${b})`
        // ctx.fillRect(x, y, resolution, resolution)
      }
      ctx.restore()

      // debug / FPS
      // drawFps(ctx)
      // drawFilters(ctx, { contrast, brightness, saturate, width, height, orientation, facingMode, activeCamera, status })
    }
  }, [imageData, palette, fontSize, contrast, brightness, saturate, height, width, orientation, facingMode, mirror, activeCamera, status])

  // TODO: stylez
  return (
    <canvas ref={canvasRef} style={{ width: "100%" }} />
  )
}

export default EmojiVision