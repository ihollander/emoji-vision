import { useRef, useEffect, useState } from 'react'
import RgbQuant from 'rgbquant'
// TODO: offload color normalization to worker thread?
// this gives faster FPS but laggier video than doing work on main thread
// also need to figure out how to abort worker in cleanup


export const usePixelatedVideo = ({ mediaStream, width, height, paletteColors, filters }) => {
  // imageData is the array of normalized pixels that will be returned
  const [imageData, setImageData] = useState(null)

  // video element will receive mediaStream as srcObject
  const videoRef = useRef(document.createElement("video"))

  // canvas will handle filter and let us analyze pixel data
  const canvasRef = useRef(document.createElement("canvas"))

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    let rafId;

    // render helper
    const render = () => {
      if (videoRef.current.readyState === 4) {
        const { width, height } = canvasRef.current

        // apply filters
        const filterString = Object.keys(filters).map(filter => {
          return `${filter}(${filters[filter] || 1.0})`
        }).join(" ")
        ctx.filter = filterString

        // draw video
        ctx.drawImage(videoRef.current, 0, 0, width, height)

        let pixelData = ctx.getImageData(0, 0, width, height).data

        const quant = new RgbQuant({
          palette: paletteColors,
          colors: paletteColors.length
        })
        pixelData = quant.reduce(pixelData)


        setImageData(pixelData)
      }

      // loop it
      rafId = requestAnimationFrame(render)
    }

    if (height > 0 && width > 0) {
      canvasRef.current.height = height
      canvasRef.current.width = width
      rafId = requestAnimationFrame(render)
    }

    return () => {
      // cancel animation and stop loop during cleanup
      cancelAnimationFrame(rafId)
    }
  }, [width, height, filters, paletteColors])

  // setup video element
  useEffect(() => {
    const video = videoRef.current

    if (mediaStream && video.srcObject !== mediaStream) {
      video.srcObject = mediaStream
      video.autoplay = true
    }
  }, [mediaStream])

  return { imageData, width, height }
}