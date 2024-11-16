export default class DebugRenderer {
  constructor(options) {
    this.options = options
  }

  process(ctx) {
    if (!this.fpsCounter) {
      this.fpsCounter = performance.now()
    }

    const fps = (1000 / (performance.now() - this.fpsCounter)).toFixed(2)

    Object.entries({ fps, ...this.options }).forEach(([key, value], index) => {
      const text = `${key}: ${value}`
      const x = 20
      const y = 100 + index * 50

      ctx.font = `bold 48px sans-serif`
      ctx.textAlign = "left"
      ctx.fillStyle = `rgb(255,0,0)`
      ctx.fillText(text, x, y)
      ctx.strokeStyle = `rgb(255,255,255)`
      ctx.strokeText(text, x, y)
    })

    this.fpsCounter = performance.now()
  }
}
