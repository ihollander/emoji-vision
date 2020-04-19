import { useRef, useEffect, useState } from 'react'
import { useUserMedia } from './useUserMedia'
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../worker'

export const usePixelatedVideo = ({ palette, resolution, width, height, filterString }) => {

  const [imageData, setImageData] = useState(null)

  const mediaStream = useUserMedia({ width, height })

  const videoRef = useRef(document.createElement("video"))
  const canvasRef = useRef(document.createElement("canvas"))
  const workerRef = useRef(worker())

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
      if (videoRef.current.readyState === 4) {
        rafId = requestAnimationFrame(render)
      }

      ctx.filter = filterString

      ctx.save()
      ctx.translate(canvasRef.current.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.restore()

      const { data } = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

      // TODO: abort work as part of cleanup fn?
      workerRef.current.normalizePixelData(data, palette)
        .then(setImageData)
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