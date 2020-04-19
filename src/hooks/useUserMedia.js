import { useEffect, useState } from 'react'

export const useUserMedia = ({ width, height }) => {
  const [mediaStream, setMediaStream] = useState(null)

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width, height }
        })
        setMediaStream(stream)
      } catch (err) {
        console.error(err)
      }
    }

    if (!mediaStream) {
      enableStream()
    } else {
      return () => {
        mediaStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [mediaStream, width, height])

  return mediaStream
}