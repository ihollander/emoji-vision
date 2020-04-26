import { useEffect, useState, useRef } from 'react'
import * as userMediaStatus from '../constants/userMedia'

// takes in constraint options (requestedWidth, requestedHeight, and facingMode)
// requests access to the user's webcam
// returns the mediaStream (which can then be used as the srcObject for a video element)
// also returns additional useful info, such as: 
// - the actual width and height of the video stream
// - the camera being used
// - status info
export const useUserMedia = (aspectRatio, requestedWidth, requestedHeight, facingMode) => {
  const [mediaStream, setMediaStream] = useState(null)
  const [activeCamera, setActiveCamera] = useState(null)
  const [status, setStatus] = useState(userMediaStatus.PENDING)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const prevFacingModeRef = useRef()

  // initialize
  useEffect(() => {
    (async () => {
      // helper fn to get useful data (width, height, camera) from the video track
      const getTrackData = stream => {
        const videoTrack = stream.getVideoTracks()[0]
        const { width, height } = videoTrack.getSettings()
        setActiveCamera(videoTrack.label)
        setWidth(width)
        setHeight(height)
        setStatus(userMediaStatus.READY)
      }

      setStatus(userMediaStatus.PENDING)
      // if the stream isn't set up or the camera switches, get a new mediaStream
      if (!mediaStream || prevFacingModeRef.current !== facingMode) {
        try {
          // for some reason, "environment" doesn't work (Pixel 4); need to use { exact: "enviroment" }
          const mode = facingMode === "user" ? "user" : { exact: "environment" }

          // get the stream
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: requestedWidth },
              height: { ideal: requestedHeight },
              // aspectRatio,
              facingMode: mode
            }
          })

          // save stream and track data
          setMediaStream(stream)
          getTrackData(stream)

          // set prevFacingModeRef to let us check when the user switches modes
          prevFacingModeRef.current = facingMode
        } catch (err) {
          setStatus(userMediaStatus.ERROR)
          // console.error(err)
        }
      } else {
        // for height/width changes, just apply the new constraints
        const videoTrack = mediaStream.getVideoTracks()[0]
        await videoTrack.applyConstraints({
          width: { ideal: requestedWidth },
          // height: { ideal: requestedHeight },
          // aspectRatio
        })
        getTrackData(mediaStream)
      }
    })()
  }, [mediaStream, aspectRatio, requestedWidth, requestedHeight, facingMode])

  // cleanup mediaStream when it's no longer needed (stop the tracks)
  useEffect(() => {
    return () => {
      setStatus(userMediaStatus.ENDED)
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [mediaStream])

  return { mediaStream, status, width, height, activeCamera }
}