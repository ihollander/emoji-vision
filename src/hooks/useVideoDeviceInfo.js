import { useEffect, useState } from "react"

const useVideoDeviceInfo = () => {
  const [videoInputDevices, setVideoInputDevices] = useState([])

  useEffect(() => {
    ;(async () => {
      // getUserMedia to ensure devices are available for enumeration in Safari
      await navigator.mediaDevices.getUserMedia({ audio: false, video: true })

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoInputDevices = []

      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          videoInputDevices.push(device)
        }
      })

      setVideoInputDevices(videoInputDevices)
    })()
  }, [])

  return videoInputDevices
}

export default useVideoDeviceInfo
