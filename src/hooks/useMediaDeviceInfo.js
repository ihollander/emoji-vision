import { useState, useEffect } from 'react'

export const useMediaDeviceInfo = () => {
  const [videoDevices, setVideoDevices] = useState([])
  const [audioInputDevices, setAudioInputDevices] = useState([])
  const [audioOutputDevices, setAudioOutputDevices] = useState([])

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = []
      const audioInputDevices = []
      const audioOutputDevices = []
      devices.forEach(device => {
        if (device.kind === "videoinput") {
          videoDevices.push(device)
        } else if (device.kind === "audioinput") {
          audioInputDevices.push(device)
        } else if (device.kind === "audiooutput") {
          audioOutputDevices.push(device)
        }
      })
      setVideoDevices(videoDevices)
      setAudioInputDevices(audioInputDevices)
      setAudioOutputDevices(audioOutputDevices)
    })()
  }, [])

  return { videoDevices, audioInputDevices, audioOutputDevices }
}