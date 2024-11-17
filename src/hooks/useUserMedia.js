import { useCallback, useEffect, useRef, useState } from "react"

import * as facingModes from "../constants/facingMode"
import * as userMediaStatus from "../constants/userMedia"
import { usePageVisibility, useVideoDeviceInfo } from "."

// takes in constraint options (orientation and facingMode)
// requests access to the user's webcam
// returns a video element playing the webcam video
// also returns additional useful info, such as:
// - the camera being used
// - status info
export const useUserMedia = ({ orientation, facingMode }) => {
  const devices = useVideoDeviceInfo()
  const mediaStreamRef = useRef()
  const videoRef = useRef(document.createElement("video"))
  const [activeCamera, setActiveCamera] = useState(null)
  const [status, setStatus] = useState(userMediaStatus.PENDING)

  const prevFacingModeRef = useRef()
  const prevOrientationRef = useRef()

  const isPageVisible = usePageVisibility()

  // cleanup mediaStream when it's no longer needed (stop the tracks)
  const cleanupTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
      setStatus(userMediaStatus.ENDED)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current

    if (devices.length > 0 && isPageVisible) {
      ;(async () => {
        setStatus(userMediaStatus.PENDING)
        // if the stream isn't set up or the camera switches, get a new mediaStream
        if (
          !mediaStreamRef.current ||
          prevFacingModeRef.current !== facingMode ||
          prevOrientationRef.current !== orientation
        ) {
          let possibleFacingModes = []
          if (facingMode === facingModes.USER) {
            possibleFacingModes.push({ facingMode: "user" })
          } else if (facingMode === facingModes.ENVIRONMENT) {
            const probableEnvironmentCamera = devices.find((device) =>
              device.label.includes("back"),
            )

            // try using environment camera
            possibleFacingModes.push({ facingMode: { ideal: "environment" } })

            if (probableEnvironmentCamera) {
              // if it doesn't work, try finding environment camera using device id
              possibleFacingModes.push({
                deviceId: probableEnvironmentCamera.deviceId,
              })
            }

            // fallback on user-facing camera :(
            possibleFacingModes.push({ facingMode: "user" })
          }

          let stream = null
          for (const mode of possibleFacingModes) {
            if (stream) break

            try {
              stream = await navigator.mediaDevices.getUserMedia({
                frameRate: 30,
                video: mode,
              })
            } catch (err) {
              console.error(err)
            }
          }

          if (stream) {
            // save stream ref for cleanup
            mediaStreamRef.current = stream
            const videoTrack = stream.getVideoTracks()[0]

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
          } else {
            setStatus(userMediaStatus.ERROR)
          }
        }
      })()
    } else {
      cleanupTracks()
    }

    return cleanupTracks
  }, [cleanupTracks, devices, orientation, facingMode, isPageVisible])

  return { video: videoRef.current, status, activeCamera }
}
