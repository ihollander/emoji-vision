// Trailing comma after new URL() breaks the regex that vite-plugin-comlink uses to identify this code,
// so no prettier here!

// prettier-ignore
// eslint-disable-next-line no-undef
export const paletteWorker = new ComlinkWorker(
  new URL("./palette.worker", import.meta.url)
)
