import { useEffect, useRef, useState } from "react"

export const useEmojiFavicon = (emoji) => {
  const [value, setValue] = useState(emoji)
  const cache = useRef({})

  useEffect(() => {
    // make new favicon link
    const updateFavicon = (imgUrl) => {
      const oldLink = document.querySelector("link[rel*='icon']")
      const newLink = document.createElement("link")
      newLink.id = "dynamic-favicon"
      newLink.rel = "shortcut icon"
      newLink.sizes = "64x64"
      newLink.type = "image/png"
      newLink.href = imgUrl

      if (oldLink) {
        document.head.removeChild(oldLink)
      }
      document.head.appendChild(newLink)
    }

    if (cache.current[value]) {
      updateFavicon(cache.current[value].src)
    } else {
      // create image
      const canvas = document.createElement("canvas")
      canvas.height = 64
      canvas.width = 64

      const ctx = canvas.getContext("2d")

      ctx.font = "64px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText(value, 32, 36)

      const imgUrl = canvas.toDataURL()

      // cache image
      const image = new Image()
      image.onload = function () {
        cache.current[value] = image
      }
      image.src = imgUrl

      // update
      updateFavicon(imgUrl)
    }
  }, [value])

  return [value, setValue]
}
