import { useEffect,useState } from 'react'

export const useDeviceDimensions = () => {
  const [orientation, setOrientation] = useState(null)
  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  useEffect(() => {
    const onDeviceOrientation = () => {
      const orientation = (window.screen.orientation || {}).type || window.screen.mozOrientation || window.screen.msOrientation

      setScreenWidth(window.screen.width)
      setScreenHeight(window.screen.height)
      if (orientation && orientation.includes("portrait")) {
        setOrientation("portrait")
      } else {
        setOrientation("landscape")
      }
    }

    window.addEventListener("deviceorientation", onDeviceOrientation)
    onDeviceOrientation()

    return () => {
      window.removeEventListener("deviceorientation", onDeviceOrientation)
    }
  }, [])

  return { orientation, screenWidth, screenHeight }
}