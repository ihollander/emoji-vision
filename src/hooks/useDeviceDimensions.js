import { useState, useEffect } from 'react'

export const useDeviceDimensions = () => {
  const [videoDevices, setVideoDevices] = useState([])
  const [orientation, setOrientation] = useState(null)
  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  useEffect(() => {
    const getOrientation = () => {
      const orientation = (window.screen.orientation || {}).type || window.screen.mozOrientation || window.screen.msOrientation
      setScreenWidth(window.screen.width)
      setScreenHeight(window.screen.height)
      if (orientation.includes("landscape")) {
        setOrientation("landscape")
      } else {
        setOrientation("portrait")
      }
    }

    window.addEventListener("deviceorientation", getOrientation)

    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === "videoinput")
        setVideoDevices(videoDevices)
        getOrientation()
      })

    return () => {
      window.removeEventListener("deviceorientation", getOrientation)
    }
  }, [])

  return { videoDevices, orientation, screenWidth, screenHeight }
}