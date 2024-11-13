import { useLayoutEffect, useState } from "react"

const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

export default useWindowSize
