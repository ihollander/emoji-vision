export default class RenderingContext {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    })
    this.renderers = []
  }

  connect(renderer) {
    this.renderers.push(renderer)
    return this
  }

  play() {
    this.render()
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  render() {
    this.rafId = requestAnimationFrame(() => this.render())

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const renderer of this.renderers) {
      renderer.process(this.ctx)
    }
  }
}
