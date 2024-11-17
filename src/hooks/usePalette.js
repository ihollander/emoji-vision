import { createContext, useContext } from "react"

const PaletteContext = createContext()

function usePalette() {
  return useContext(PaletteContext)
}

export { PaletteContext }
export default usePalette
