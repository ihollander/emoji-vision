import { useEffect, useState, useRef } from 'react'
import RgbQuant from 'rgbquant'
import { numberToColor } from '../utils/color'

export const useImageData = (constraints, palette) => {
  const [imageData, setImageData] = useState(null)
  const chunk = useVideoImage(constraints)
  const canvasRef = useRef(document.createElement("canvas"))

  useEffect(() => {
    let rafId;

    if (chunk && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      const render = () => {
        ctx.drawImage(chunk, 0, 0, canvasRef.current.width, canvasRef.current.height)

        let pixelData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data

        const paletteColors = Object.keys(palette).map(key => numberToColor(key))
        if (paletteColors.length) {
          const quant = new RgbQuant({
            palette: paletteColors,
            colors: paletteColors.length
          })
          pixelData = quant.reduce(pixelData)
        }

        setImageData(pixelData)

        rafId = requestAnimationFrame(render)
      }
      rafId = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [chunk, palette])

  return imageData
}

export const useVideoImage = constraints => {
  const [mediaStream, setMediaStream] = useState(null)
  const [status, setStatus] = useState("pending")
  const [chunk, setChunk] = useState(null)

  // initialize
  useEffect(() => {
    let rafId

    const capture = imageCapture => {
      imageCapture.takePhoto()
        .then(blob => createImageBitmap(blob))
        .then(imageBitmap => {
          setChunk(imageBitmap)
          rafId = requestAnimationFrame(() => capture(imageCapture))
        })
    }

    if (!mediaStream) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          setMediaStream(stream)
          setStatus("fetched")
        })
        .catch(err => {
          setStatus("error")
        })
    } else {
      const track = mediaStream.getVideoTracks()[0]
      const imageCapture = new ImageCapture(track);
      if (track) {
        track.enabled = true
        track.applyConstraints(constraints.video)
          .then(() => {
            const { width, height } = track.getSettings()
            console.log({ width, height })

            // loop de loop
            rafId = requestAnimationFrame(() => capture(imageCapture))
          })
      }
    }

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [mediaStream, constraints])

  // cleanup
  useEffect(() => {
    return () => {
      setStatus("ended")
      console.log("media ended")
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach(track => {
          track.enabled = false
        })
      }
    }
  }, [mediaStream])

  return chunk
}