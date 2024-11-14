import { useEffect, useState } from "react"

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState(null)

  useEffect(() => {
    const onDeviceOrientation = () => {
      const orientation =
        (window.screen.orientation || {}).type ||
        window.screen.mozOrientation ||
        window.screen.msOrientation

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

  return orientation
}

export default useDeviceOrientation
