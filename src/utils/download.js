function downloadImage(canvas) {
  // create background canvas so we don't end up with transparent background
  const bgCanvas = document.createElement("canvas")
  bgCanvas.width = canvas.width
  bgCanvas.height = canvas.height

  const ctx = bgCanvas.getContext("2d")
  ctx.fillStyle = "#fff8e7"
  ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
  ctx.drawImage(canvas, 0, 0)

  const link = document.createElement("a")
  document.body.append(link)
  link.download = "emojivision.png"
  link.href = bgCanvas.toDataURL()
  link.click()
  link.remove()
}

export default downloadImage
