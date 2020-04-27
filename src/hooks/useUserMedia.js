import { useEffect, useState, useRef } from 'react'
import * as userMediaStatus from '../constants/userMedia'

// takes in constraint options (orientation and facingMode)
// requests access to the user's webcam
// returns the mediaStream (which can then be used as the srcObject for a video element)
// also returns additional useful info, such as: 
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
      setStatus(userMediaStatus.PENDING)
      // if the stream isn't set up or the camera switches, get a new mediaStream
      if (!mediaStream || prevFacingModeRef.current !== facingMode || prevOrientationRef.current !== orientation) {
        try {
          // for some reason, "environment" doesn't work (Pixel 4); need to use { ideal: "enviroment" } or { exact: "enviroment" }
          const mode = facingMode === "user" ? "user" : { ideal: "environment" }

          // get the stream
          const stream = await navigator.mediaDevices.getUserMedia({
            frameRate: 30,
            video: { facingMode: mode }
          })

          // save stream and track data
          const videoTrack = stream.getVideoTracks()[0]
          setMediaStream(stream)
          setActiveCamera(videoTrack.label)
          setStatus(userMediaStatus.READY)

          // set refs to let us check when the user switches modes
          prevFacingModeRef.current = facingMode
          prevOrientationRef.current = orientation
        } catch (err) {
          setStatus(userMediaStatus.ERROR)
          // console.error(err)
        }
      }
    })()

    // cleanup mediaStream when it's no longer needed (stop the tracks)
    return () => {
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach(track => {
          track.stop()
        })
        setStatus(userMediaStatus.ENDED)
      }
    }
  }, [mediaStream, orientation, facingMode])

  return { mediaStream, status, activeCamera }
}