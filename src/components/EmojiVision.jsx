import { useEffect } from "react"

import * as userMediaStatus from "../constants/userMedia"
import { useUserMedia } from "../hooks"
import useControls from "../hooks/useControls"
import useDeviceOrientation from "../hooks/useDeviceOrientation"
import usePalette from "../hooks/usePalette"
import useWindowSize from "../hooks/useWindowSize"
import DebugRenderer from "../videoProcessing/DebugRenderer"
import EmojiRenderer from "../videoProcessing/EmojiRenderer"
import RenderingContext from "../videoProcessing/RenderingContext"
import ResizeVideoRenderer from "../videoProcessing/ResizeVideoRenderer"

const EmojiVision = ({ canvasRef }) => {
  const { fontSize, brightness, saturate, contrast, facingMode, debug } =
    useControls()

  // TODO: will this work for mobile, or do we need to use device orientation too?
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // emoji array used to build palette
  const { palette } = usePalette()

  const orientation = useDeviceOrientation()

  const {
    activeCamera,
    status: mediaStatus,
    video,
  } = useUserMedia({ orientation, facingMode })

  // resize canvas when window resizes
  useEffect(() => {
    canvasRef.current.width = windowWidth * 2
    canvasRef.current.height = windowHeight * 2
  }, [canvasRef, windowWidth, windowHeight])

  // draw emoji using media stream via video element
  useEffect(() => {
    if (
      canvasRef.current &&
      palette &&
      mediaStatus === userMediaStatus.PLAYING
    ) {
      const renderingContext = new RenderingContext(canvasRef.current)

      const pixelVideoWidth = Math.floor(windowWidth / fontSize)
      const pixelVideoHeight = Math.floor(windowWidth / fontSize)

      const resizeVideoRenderer = new ResizeVideoRenderer({
        aspectRatio: video.videoWidth / video.videoHeight,
        facingMode,
        filter: Object.entries({ brightness, contrast, saturate })
          .map(([key, value]) => `${key}(${value || 1.0})`)
          .join(" "),
        pixelVideoHeight,
        pixelVideoWidth,
        video: video,
      })

      const emojiRenderer = new EmojiRenderer({
        facingMode,
        fontSize,
        palette,
        pixelMode: false,
        pixelVideoWidth,
        pixelVideoHeight,
      })

      renderingContext.connect(resizeVideoRenderer).connect(emojiRenderer)

      if (debug) {
        const debugRenderer = new DebugRenderer({
          activeCamera,
          brightness,
          contrast,
          fontSize,
          orientation,
          saturate,
          windowHeight,
          windowWidth,
          facingMode,
        })

        renderingContext.connect(debugRenderer)
      }

      renderingContext.play()

      return () => renderingContext.stop()
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
