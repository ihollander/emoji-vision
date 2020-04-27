import { useState, useEffect } from 'react'

export const useDeviceDimensions = () => {
  const [videoDevices, setVideoDevices] = useState([])
  const [orientation, setOrientation] = useState(null)
  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  useEffect(() => {
    const onDeviceOrientation = () => {
      const orientation = (window.screen.orientation || {}).type || window.screen.mozOrientation || window.screen.msOrientation
      setScreenWidth(window.screen.width)
      setScreenHeight(window.screen.height)
      if (orientation.includes("landscape")) {
        setOrientation("landscape")
      } else {
        setOrientation("portrait")
      }
    }

    window.addEventListener("deviceorientation", onDeviceOrientation)

    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === "videoinput")
        setVideoDevices(videoDevices)
        onDeviceOrientation()
      })

    return () => {
      window.removeEventListener("deviceorientation", onDeviceOrientation)
    }
  }, [])

  return { videoDevices, orientation, screenWidth, screenHeight }
}