import { useState, useEffect } from 'react'

export const useMediaDeviceInfo = () => {
  const [videoDevices, setVideoDevices] = useState([])
  const [audioDevices, setAudioDevices] = useState([])

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = []
      const audioDevices = []
      devices.forEach(device => {
        if (device.kind === "videoinput") {
          videoDevices.push(device)
        } else if (device.kind === "audioinput") {
          audioDevices.push(device)
        }
      })
      setVideoDevices(videoDevices)
      setAudioDevices(audioDevices)
    })()
  }, [])

  return { videoDevices, audioDevices }
}