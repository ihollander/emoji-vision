import { useEffect, useState } from "react"

export const useMediaDeviceInfo = () => {
  const [videoInputDevices, setVideoInputDevices] = useState([])
  const [audioInputDevices, setAudioInputDevices] = useState([])
  const [audioOutputDevices, setAudioOutputDevices] = useState([])

  useEffect(() => {
    ;(async () => {
      // getUserMedia to ensure devices are available for enumeration in Safari
      await navigator.mediaDevices.getUserMedia({ audio: false, video: true })

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoInputDevices = []
      const audioInputDevices = []
      const audioOutputDevices = []

      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          videoInputDevices.push(device)
        } else if (device.kind === "audioinput") {
          audioInputDevices.push(device)
        } else if (device.kind === "audiooutput") {
          audioOutputDevices.push(device)
        }
      })

      setVideoInputDevices(videoInputDevices)
      setAudioInputDevices(audioInputDevices)
      setAudioOutputDevices(audioOutputDevices)
    })()
  }, [])

  return { videoInputDevices, audioInputDevices, audioOutputDevices }
}
