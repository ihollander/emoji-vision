export default class ResizeVideoRenderer {
  constructor({
    aspectRatio,
    facingMode,
    filter,
    pixelVideoHeight,
    pixelVideoWidth,
    video,
  }) {
    this.facingMode = facingMode
    this.filter = filter
    this.pixelVideoWidth = pixelVideoWidth
    this.pixelVideoHeight = pixelVideoHeight
    this.video = video

    this.width = Math.floor(pixelVideoHeight * aspectRatio)
    this.height = Math.floor(pixelVideoWidth / aspectRatio)

    this.offsetX =
      this.width > pixelVideoWidth ? (this.width - pixelVideoWidth) / 2 : 0
    this.offsetY =
      this.height > pixelVideoHeight ? (this.height - pixelVideoHeight) / 2 : 0

    // intermediary canvas for resizing video
    this.resizeCanvas = document.createElement("canvas")
    this.resizeCtx = this.resizeCanvas.getContext("2d")
    this.resizeCanvas.width = this.width
    this.resizeCanvas.height = this.height
  }

  process(ctx) {
    this.resizeCtx.save()

    // mirror the video if needed
    if (this.facingMode === "user") {
      this.resizeCtx.translate(this.resizeCanvas.width, 0)
      this.resizeCtx.scale(-1, 1)
    }

    // setup filters
    this.resizeCtx.filter = this.filter

    // resize video
    this.resizeCtx.drawImage(this.video, 0, 0, this.width, this.height)

    this.resizeCtx.restore()

    // draw cropped/resized video to main canvas
    ctx.drawImage(
      this.resizeCanvas,
      this.offsetX,
      this.offsetY,
      this.width - this.offsetX * 2,
      this.height - this.offsetY * 2,
      0,
      0,
      this.pixelVideoWidth,
      this.pixelVideoHeight,
    )
  }
}
