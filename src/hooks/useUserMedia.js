import { useEffect, useRef, useState } from "react"

import * as userMediaStatus from "../constants/userMedia"
import { usePageVisibility } from "."

// takes in constraint options (orientation and facingMode)
// requests access to the user's webcam
// returns a video element playing the webcam video
// also returns additional useful info, such as:
// - the camera being used
// - status info
export const useUserMedia = ({ orientation, facingMode }) => {
  const mediaStreamRef = useRef()
  const videoRef = useRef(document.createElement("video"))
  const [activeCamera, setActiveCamera] = useState(null)
  const [status, setStatus] = useState(userMediaStatus.PENDING)

  const prevFacingModeRef = useRef()
  const prevOrientationRef = useRef()

  const isPageVisible = usePageVisibility()

  useEffect(() => {
    const video = videoRef.current

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
            // for some reason, "environment" doesn't work (Pixel 4); need to use { ideal: "environment" } or { exact: "environment" }
            const mode =
              facingMode === "user" ? "user" : { ideal: "environment" }

            // get the stream
            const stream = await navigator.mediaDevices.getUserMedia({
              frameRate: 30,
              video: { facingMode: mode },
            })

            // save stream ref for cleanup
            const videoTrack = stream.getVideoTracks()[0]
            mediaStreamRef.current = stream

            // pipe to video
            video.srcObject = stream
            video.autoplay = true
            video.oncanplay = () => video.play()
            video.onplay = () => {
              setStatus(userMediaStatus.PLAYING)
            }

            // track status
            setActiveCamera(videoTrack.label)

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
        video.stop()
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
        video.stop()
        setStatus(userMediaStatus.ENDED)
      }
    }
  }, [orientation, facingMode, isPageVisible])

  return { video: videoRef.current, status, activeCamera }
}
