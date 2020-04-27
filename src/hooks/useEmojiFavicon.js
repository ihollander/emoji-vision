import { useState, useEffect } from "react"

export const useEmojiFavicon = emoji => {
  const [value, setValue] = useState(emoji)

  useEffect(() => {
    const oldLink = document.querySelector("link[rel*='icon']")
    const newLink = document.createElement("link")

    const canvas = document.createElement("canvas")
    canvas.height = 64
    canvas.width = 64

    const ctx = canvas.getContext('2d')

    ctx.font = "64px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(value, 32, 36)

    newLink.id = "dynamic-favicon"
    newLink.rel = "shortcut icon"
    newLink.sizes = "64x64"
    newLink.type = "image/png"
    newLink.href = canvas.toDataURL()

    if (oldLink) {
      document.head.removeChild(oldLink)
    }
    document.head.appendChild(newLink)
  }, [value])

  return [value, setValue]
}