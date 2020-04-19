import { useEffect, useRef } from 'react'

export const useAnimatedCanvas = (animation, context = "2d") => {
  const canvasRef = useRef(null)

  useEffect(() => {
    let animationFrameId;

    if (canvasRef.current) {
      if (typeof animate === "function") {
        const ctx = canvasRef.current.getContext(context)

        // animation loop
        const renderFrame = () => {
          animationFrameId = requestAnimationFrame(renderFrame)
          animation(ctx)
        }

        animationFrameId = requestAnimationFrame(renderFrame)
      }
    }

    // cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [animation, context])

  return canvasRef
}