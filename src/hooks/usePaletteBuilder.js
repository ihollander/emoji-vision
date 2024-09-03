import { createContext, useContext } from "react"

const PaletteBuilderContext = createContext()

function usePaletteBuilder() {
  return useContext(PaletteBuilderContext)
}

export { PaletteBuilderContext }
export default usePaletteBuilder
