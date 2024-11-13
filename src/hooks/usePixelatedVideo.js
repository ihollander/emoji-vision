import { useEffect, useRef, useState } from "react"
import RgbQuant from "rgbquant"

import useWindowSize from "./useWindowSize"

// TODO: offload color normalization to worker thread?
// this gives faster FPS but laggier video than doing work on main thread
// also need to figure out how to abort worker in cleanup
export const usePixelatedVideo = ({
  fontSize,
  mediaStream,
  paletteColors,
  brightness,
  saturate,
  contrast,
}) => {
  // probably don't need this? can just read window size on each animation frame
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // imageData is the array of normalized pixels that will be returned
  const [imageData, setImageData] = useState(null)

  // video width/height come from the video element (video.videoWidth .videoHeight)
  // probably don't need this? can just read from video on each animation frame
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)

  // pixelated canvas width/height are calculated from windowWidth/windowHeight and fontSize
  const canvasWidth = Math.floor(windowWidth / fontSize)
  const canvasHeight = Math.floor(windowHeight / fontSize)

  // video element will receive mediaStream as srcObject
  const videoRef = useRef(document.createElement("video"))

  // canvas will handle filter and let us analyze pixel data
  const canvasRef = useRef(document.createElement("canvas"))

  // rafId keeps track of requestAnimationFrame id
  const rafIdRef = useRef()

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")

    // render helper
    const render = () => {
      // setup next loop
      rafIdRef.current = requestAnimationFrame(render)

      // if video is ready and palette is ready
      if (videoRef.current.readyState === 4 && paletteColors.length) {
        // apply filters
        const filters = { brightness, saturate, contrast }
        const filterString = Object.keys(filters)
          .map((filter) => {
            return `${filter}(${filters[filter] || 1.0})`
          })
          .join(" ")
        ctx.filter = filterString

        // draw video
        // TODO: crop based on aspect ratio of window?
        // drawImageProp(ctx, videoRef.current, 0, 0, canvasWidth, canvasHeight)

        // step 1 - resize video
        const videoAR = videoWidth / videoHeight
        let resizeWidth = Math.max(
          canvasWidth,
          Math.floor(canvasHeight * videoAR),
        )
        let resizeHeight = Math.max(
          canvasHeight,
          Math.floor(canvasWidth / videoAR),
        )

        const resizeVideoCanvas = document.createElement("canvas")
        const resizeVideoCanvasCtx = resizeVideoCanvas.getContext("2d")

        resizeVideoCanvas.width = resizeWidth
        resizeVideoCanvas.height = resizeHeight

        resizeVideoCanvasCtx.drawImage(
          videoRef.current,
          0,
          0,
          resizeWidth,
          resizeHeight,
        )

        let offsetX = 0
        let offsetY = 0

        // step 2 - crop video
        if (resizeWidth > canvasWidth) {
          offsetX = (resizeWidth - canvasWidth) / 2
        } else {
          offsetY = (resizeHeight - canvasHeight) / 2
        }

        ctx.drawImage(
          resizeVideoCanvas,
          offsetX,
          offsetY,
          canvasWidth,
          canvasHeight,
          0,
          0,
          canvasWidth,
          canvasHeight,
        )

        let pixelData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data

        const quant = new RgbQuant({
          palette: paletteColors,
          colors: paletteColors.length,
        })
        pixelData = quant.reduce(pixelData)

        setImageData(pixelData)
      }
    }

    // setup canvas width/height from changes to video width/height + font size
    if (canvasWidth > 0 && canvasHeight > 0) {
      canvasRef.current.width = canvasWidth
      canvasRef.current.height = canvasHeight
      rafIdRef.current = requestAnimationFrame(render)
    }

    return () => {
      // cancel animation and stop loop during cleanup
      cancelAnimationFrame(rafIdRef.current)
    }
  }, [
    brightness,
    canvasHeight,
    canvasWidth,
    contrast,
    paletteColors,
    saturate,
    videoHeight,
    videoWidth,
  ])

  // setup video element
  useEffect(() => {
    const video = videoRef.current

    if (mediaStream) {
      // new source
      if (video.srcObject !== mediaStream) {
        video.srcObject = mediaStream
        video.autoplay = true
        video.oncanplay = () => {
          video.play()
        }

        video.onloadeddata = () => {
          setVideoWidth(video.videoWidth)
          setVideoHeight(video.videoHeight)
        }
      }
    }
  }, [mediaStream])

  return { imageData, canvasWidth, canvasHeight }
}
