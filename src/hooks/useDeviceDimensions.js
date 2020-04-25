import { useState, useEffect } from 'react'

export const useDeviceDimensions = () => {
  const [videoDeviceCount, setVideoDeviceCount] = useState(0)
  const [orientation, setOrientation] = useState(null)
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)

  useEffect(() => {
    const getOrientation = () => {
      const orientation = (window.screen.orientation || {}).type || window.screen.mozOrientation || window.screen.msOrientation;

      if (orientation.includes("landscape")) {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        setOrientation("landscape")
        setVw(vw)
        setVh(vh)
      } else {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        setOrientation("portrait")
        setVw(vw)
        setVh(vh)
      }
    }

    window.addEventListener("deviceorientation", getOrientation)

    // let's do some setup
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDeviceCount = devices.filter(device => device.kind === "videoinput").length
        console.log(devices, videoDeviceCount)
        setVideoDeviceCount(videoDeviceCount)
        getOrientation()
      })


    return () => {
      window.removeEventListener("deviceorientation", getOrientation)
    }
  }, [])

  return { videoDeviceCount, orientation, vw, vh }
}