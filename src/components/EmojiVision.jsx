import { useEffect, useRef } from "react"

import * as userMediaStatus from "../constants/userMedia"
import { useDeviceDimensions, usePaletteBuilder, useUserMedia } from "../hooks"
import useControls from "../hooks/useControls"
import useWindowSize from "../hooks/useWindowSize"
import drawEmojiVideo from "../utils/draw"

const EmojiVision = ({ canvasRef }) => {
  const { fontSize, brightness, saturate, contrast, facingMode, debug } =
    useControls()
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // emoji array used to build palette
  const { palette, paletteColors } = usePaletteBuilder()

  const { orientation } = useDeviceDimensions()

  const {
    status: mediaStatus,
    mediaStream,
    activeCamera,
  } = useUserMedia({ orientation, facingMode })

  const videoRef = useRef(document.createElement("video"))

  // pipe mediaStream to video element
  useEffect(() => {
    const video = videoRef.current

    if (mediaStream) {
      // new source
      if (video.srcObject !== mediaStream) {
        video.srcObject = mediaStream
        video.autoplay = true
        video.oncanplay = () => video.play()
      }
    }
  }, [mediaStream])

  // // take new imageData and draw emojis
  useEffect(() => {
    if (
      canvasRef.current &&
      paletteColors.length &&
      mediaStatus === userMediaStatus.READY
    ) {
      const ctx = canvasRef.current.getContext("2d")

      return drawEmojiVideo(ctx, videoRef.current, {
        activeCamera,
        brightness,
        contrast,
        debug,
        facingMode,
        fontSize,
        palette,
        paletteColors,
        saturate,
        windowWidth,
        windowHeight,
      })
    }
  }, [
    activeCamera,
    brightness,
    canvasRef,
    contrast,
    debug,
    facingMode,
    fontSize,
    mediaStatus,
    orientation,
    palette,
    paletteColors,
    saturate,
    windowWidth,
    windowHeight,
  ])

  return <canvas className="h-screen w-screen bg-black" ref={canvasRef} />
}

export default EmojiVision
