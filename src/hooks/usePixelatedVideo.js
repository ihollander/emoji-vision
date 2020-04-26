import { useRef, useEffect, useState } from 'react'
import RgbQuant from 'rgbquant'
// TODO: offload color normalization to worker thread?
// this gives faster FPS but laggier video than doing work on main thread
// also need to figure out how to abort worker in cleanup
export const usePixelatedVideo = ({
  fontSize,
  mediaStream,
  paletteColors,
  brightness,
  saturate,
  contrast
}) => {
  // imageData is the array of normalized pixels that will be returned
  const [imageData, setImageData] = useState(null)

  // video width/height come from the video element (video.videoWidth .videoHeight)
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)

  // canvas width/height are calculated from videoWidth/videoHeight and fontSize (dupe state?)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)

  // video element will receive mediaStream as srcObject
  const videoRef = useRef(document.createElement("video"))

  // canvas will handle filter and let us analyze pixel data
  const canvasRef = useRef(document.createElement("canvas"))

  // rafId keeps track of requestAnimationFrame id
  const rafIdRef = useRef()

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    // render helper
    const render = () => {
      // setup next loop
      rafIdRef.current = requestAnimationFrame(render)

      // if video is ready
      if (videoRef.current.readyState === 4) {
        // apply filters
        const filters = { brightness, saturate, contrast }
        const filterString = Object.keys(filters).map(filter => {
          return `${filter}(${filters[filter] || 1.0})`
        }).join(" ")
        ctx.filter = filterString

        // draw video
        ctx.drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight)

        let pixelData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data

        const quant = new RgbQuant({
          palette: paletteColors,
          colors: paletteColors.length
        })
        pixelData = quant.reduce(pixelData)


        setImageData(pixelData)
      }
    }

    if (canvasWidth > 0 && canvasHeight > 0) {
      rafIdRef.current = requestAnimationFrame(render)
    }

    return () => {
      // cancel animation and stop loop during cleanup
      cancelAnimationFrame(rafIdRef.current)
    }
  }, [canvasWidth, canvasHeight, brightness, saturate, contrast, paletteColors])

  // setup canvas width/height from changes to video width/height + font size
  useEffect(() => {
    if (videoWidth > 0 && videoHeight > 0) {
      canvasRef.current.width = videoWidth / fontSize
      canvasRef.current.height = videoHeight / fontSize
      setCanvasWidth(videoWidth / fontSize)
      setCanvasHeight(videoHeight / fontSize)
    }
  }, [fontSize, videoHeight, videoWidth])

  // setup video element
  useEffect(() => {
    const video = videoRef.current

    if (mediaStream && video.srcObject !== mediaStream) {
      video.srcObject = mediaStream
      video.autoplay = true

      video.onloadeddata = () => {
        setVideoWidth(video.videoWidth)
        setVideoHeight(video.videoHeight)
      }
    }
  }, [mediaStream])

  return { imageData, canvasWidth, canvasHeight }
}