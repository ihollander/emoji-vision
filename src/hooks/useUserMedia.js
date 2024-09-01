import { useEffect, useRef, useState } from "react"

import * as userMediaStatus from "../constants/userMedia"
import { usePageVisibility } from "."

// takes in constraint options (orientation and facingMode)
// requests access to the user's webcam
// returns the mediaStream (which can then be used as the srcObject for a video element)
// also returns additional useful info, such as:
// - the camera being used
// - status info
export const useUserMedia = ({ orientation, facingMode }) => {
  const mediaStreamRef = useRef()
  const [activeCamera, setActiveCamera] = useState(null)
  const [status, setStatus] = useState(userMediaStatus.PENDING)

  const prevFacingModeRef = useRef()
  const prevOrientationRef = useRef()

  const isPageVisible = usePageVisibility()

  // initialize
  useEffect(() => {
    if (isPageVisible) {
      ;(async () => {
        setStatus(userMediaStatus.PENDING)
        // if the stream isn't set up or the camera switches, get a new mediaStream
        if (
          !mediaStreamRef.current ||
          prevFacingModeRef.current !== facingMode ||
          prevOrientationRef.current !== orientation
        ) {
          try {
            // for some reason, "environment" doesn't work (Pixel 4); need to use { ideal: "enviroment" } or { exact: "enviroment" }
            const mode =
              facingMode === "user" ? "user" : { ideal: "environment" }

            // get the stream
            const stream = await navigator.mediaDevices.getUserMedia({
              frameRate: 30,
              video: { facingMode: mode },
            })

            // save stream and track data
            const videoTrack = stream.getVideoTracks()[0]
            mediaStreamRef.current = stream
            setActiveCamera(videoTrack.label)
            setStatus(userMediaStatus.READY)

            // set refs to let us check when the user switches modes
            prevFacingModeRef.current = facingMode
            prevOrientationRef.current = orientation
          } catch {
            setStatus(userMediaStatus.ERROR)
          }
        }
      })()
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.stop()
        })
        mediaStreamRef.current = null
        setStatus(userMediaStatus.ENDED)
      }
    }

    // cleanup mediaStream when it's no longer needed (stop the tracks)
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.stop()
        })
        setStatus(userMediaStatus.ENDED)
      }
    }
  }, [orientation, facingMode, isPageVisible])

  return { mediaStream: mediaStreamRef.current, status, activeCamera }
}
