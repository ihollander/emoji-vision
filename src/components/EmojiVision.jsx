import { useEffect } from "react"

import * as userMediaStatus from "../constants/userMedia"
import { usePaletteBuilder, useUserMedia } from "../hooks"
import useControls from "../hooks/useControls"
import useDeviceOrientation from "../hooks/useDeviceOrientation"
import useWindowSize from "../hooks/useWindowSize"
import drawEmojiVideo from "../utils/draw"

const EmojiVision = ({ canvasRef }) => {
  const { fontSize, brightness, saturate, contrast, facingMode, debug } =
    useControls()

  // TODO: will this work for mobile, or do we need to use device orientation too?
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // emoji array used to build palette
  const { palette } = usePaletteBuilder()

  const orientation = useDeviceOrientation()

  const {
    activeCamera,
    status: mediaStatus,
    video,
  } = useUserMedia({ orientation, facingMode })

  // draw emoji using media stream via video element
  useEffect(() => {
    if (
      canvasRef.current &&
      palette &&
      mediaStatus === userMediaStatus.PLAYING
    ) {
      const ctx = canvasRef.current.getContext("2d")

      return drawEmojiVideo(ctx, video, {
        activeCamera,
        brightness,
        contrast,
        debug,
        facingMode,
        fontSize,
        palette,
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
    saturate,
    video,
    windowWidth,
    windowHeight,
  ])

  return <canvas className="h-screen w-screen bg-black" ref={canvasRef} />
}

export default EmojiVision
