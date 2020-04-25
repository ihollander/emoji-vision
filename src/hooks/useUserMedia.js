import { useEffect, useState, useRef } from 'react'

export const useUserMedia = (requestedWidth, requestedHeight, facingMode) => {
  const [mediaStream, setMediaStream] = useState(null)
  const [activeCamera, setActiveCamera] = useState(null)
  const [status, setStatus] = useState("pending")
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const prevFacingModeRef = useRef()

  // initialize
  useEffect(() => {
    (async () => {
      const getTrackData = stream => {
        const videoTrack = stream.getVideoTracks()[0]
        // videoTrack.enabled = true
        const { width, height } = videoTrack.getSettings()
        setActiveCamera(videoTrack.label)
        setWidth(width)
        setHeight(height)
        setStatus("ready")
      }

      setStatus("pending")
      if (!mediaStream || prevFacingModeRef.current !== facingMode) {
        try {
          setStatus("switching media: " + facingMode)
          if (mediaStream) {
            mediaStream.getVideoTracks().forEach(track => track.stop())
          }
          const mode = facingMode === "user" ? "user" : { exact: "environment" }
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { max: requestedWidth },
              height: { max: requestedHeight },
              facingMode: mode
            }
          })
          setMediaStream(stream)
          getTrackData(stream)

          // set prevFacingModeRef at the end...
          prevFacingModeRef.current = facingMode
        } catch (err) {
          console.log("yikes!", err)
        }
      } else {
        setStatus("updating")
        const videoTrack = mediaStream.getVideoTracks()[0]
        await videoTrack.applyConstraints({
          width: { max: requestedWidth },
          height: { max: requestedHeight }
        })
        getTrackData(mediaStream)
      }
    })()
  }, [mediaStream, requestedWidth, requestedHeight, facingMode])

  // cleanup
  useEffect(() => {
    return () => {
      setStatus("ended")
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [mediaStream])

  return { mediaStream, status, width, height, activeCamera }
}