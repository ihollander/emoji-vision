import { useEffect, useState, useRef } from 'react'
import * as userMediaStatus from '../constants/userMedia'

// takes in constraint options (requestedWidth, requestedHeight, and facingMode)
// requests access to the user's webcam
// returns the mediaStream (which can then be used as the srcObject for a video element)
// also returns additional useful info, such as: 
// - the actual width and height of the video stream
// - the camera being used
// - status info
export const useUserMedia = (orientation, facingMode) => {
  const [mediaStream, setMediaStream] = useState(null)
  const [activeCamera, setActiveCamera] = useState(null)
  const [status, setStatus] = useState(userMediaStatus.PENDING)

  const prevFacingModeRef = useRef()
  const prevOrientationRef = useRef()

  // initialize
  useEffect(() => {
    (async () => {
      // helper fn to get useful data (width, height, camera) from the video track
      const getTrackData = stream => {
        const videoTrack = stream.getVideoTracks()[0]
        setActiveCamera(videoTrack.label)
        setStatus(userMediaStatus.READY)
      }

      setStatus(userMediaStatus.PENDING)

      // if the stream isn't set up or the camera switches, get a new mediaStream
      if (!mediaStream || prevFacingModeRef.current !== facingMode || prevOrientationRef.current !== orientation) {
        try {
          // for some reason, "environment" doesn't work (Pixel 4); need to use { exact: "enviroment" }
          const mode = facingMode === "user" ? "user" : { exact: "environment" }

          // get the stream
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode }
          })

          // save stream and track data
          setMediaStream(stream)
          getTrackData(stream)

          // set prevFacingModeRef to let us check when the user switches modes
          prevFacingModeRef.current = facingMode
          prevOrientationRef.current = orientation
        } catch (err) {
          setStatus(userMediaStatus.ERROR)
          // console.error(err)
        }
      }
    })()
  }, [mediaStream, orientation, facingMode])

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

  return { mediaStream, status, activeCamera }
}