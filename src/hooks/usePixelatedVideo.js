import { useRef, useEffect, useState } from 'react'
import RgbQuant from 'rgbquant'
import { numberToColor } from '../utils/color'
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!../worker'

export const usePixelatedVideo = ({ mediaStream, palette, resolution, width, height, filterString }) => {

  const [imageData, setImageData] = useState(null)

  const videoRef = useRef(document.createElement("video"))
  const canvasRef = useRef(document.createElement("canvas"))
  // const workerRef = useRef(worker())

  useEffect(() => {
    let rafId;
    let ctx;

    const setupVideo = () => {
      videoRef.current.autoplay = true
      videoRef.current.height = height
      videoRef.current.width = width
      videoRef.current.srcObject = mediaStream
      videoRef.current.addEventListener("canplay", () => {
        setupCanvas()
        rafId = requestAnimationFrame(render)
      })
    }

    const setupCanvas = () => {
      const compressedHeight = Math.floor(height / resolution)
      const compressedWidth = Math.floor(width / resolution)
      if (canvasRef.current.height !== compressedHeight && canvasRef.current.width !== compressedWidth) {
        canvasRef.current.height = compressedHeight
        canvasRef.current.width = compressedWidth
      }
      ctx = canvasRef.current.getContext('2d')
    }

    const render = () => {
      ctx.filter = filterString

      ctx.save()
      ctx.translate(canvasRef.current.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.restore()

      const { data } = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

      // offload color normalization to worker thread
      // this gives faster FPS but laggier video than doing work on main thread
      // TODO: abort work as part of cleanup fn?
      let pixelData = data
      const paletteColors = Object.keys(palette).map(key => numberToColor(key))
      if (paletteColors.length) {
        const quant = new RgbQuant({
          palette: paletteColors,
          colors: paletteColors.length
        })
        pixelData = quant.reduce(pixelData)
      }
      setImageData(pixelData)

      if (videoRef.current.readyState === 4) {
        rafId = requestAnimationFrame(render)
      }
    }

    // if srcObject isn't set, setup the video
    if (mediaStream && videoRef.current && canvasRef.current && !videoRef.current.srcObject) {
      // setupVideo will call setup canvas and render when video is playable
      setupVideo()
    }

    // if srcObject has been set (but something else has changed), re-run canvas config and start render again
    if (videoRef.current.srcObject) {
      setupCanvas()
      rafId = requestAnimationFrame(render)
    }

    return () => {
      // cancel animation and stop loop during cleanup
      cancelAnimationFrame(rafId)
    }
  }, [mediaStream, palette, resolution, height, width, filterString])

  return imageData
}