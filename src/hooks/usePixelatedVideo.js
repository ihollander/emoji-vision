import { useRef, useEffect, useState } from 'react'
import RgbQuant from 'rgbquant'
import { numberToColor } from '../utils/color'
import { useUserMedia } from './useUserMedia'

export const usePixelatedVideo = ({ constraints, palette, filterString }) => {
  const { width, height, status, mediaStream, activeCamera } = useUserMedia(constraints.video.width.max, constraints.video.height.max, constraints.video.facingMode)

  const [imageData, setImageData] = useState(null)

  const videoRef = useRef(document.createElement("video"))
  const canvasRef = useRef(document.createElement("canvas"))

  // setup canvas element
  useEffect(() => {
    let ctx;
    let rafId;

    const render = () => {
      if (videoRef.current.readyState === 4) {
        ctx.filter = filterString
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        // offload color normalization to worker thread?
        // this gives faster FPS but laggier video than doing work on main thread
        // TODO: abort work as part of cleanup fn?
        let pixelData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data

        const paletteColors = Object.keys(palette).map(key => numberToColor(key))

        if (paletteColors.length) {
          const quant = new RgbQuant({
            palette: paletteColors,
            colors: paletteColors.length
          })
          pixelData = quant.reduce(pixelData)
        }

        setImageData(pixelData)
      } else {
        setImageData(new Uint32Array())
      }

      // loop it
      rafId = requestAnimationFrame(render)
    }

    if (height > 0 && width > 0) {
      canvasRef.current.height = height
      canvasRef.current.width = width
      ctx = canvasRef.current.getContext('2d')
      rafId = requestAnimationFrame(render)
    }

    return () => {
      // cancel animation and stop loop during cleanup
      cancelAnimationFrame(rafId)
    }
  }, [width, height, filterString, palette])

  // setup video element
  useEffect(() => {
    const video = videoRef.current

    if (mediaStream && video.srcObject !== mediaStream) {
      video.srcObject = mediaStream
      video.autoplay = true
    }

  }, [mediaStream, status])

  return { imageData, width, height, activeCamera, status }
}