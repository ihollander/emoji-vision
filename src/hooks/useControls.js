import { createContext, useContext } from "react"

const ControlsContext = createContext()

function useControls() {
  return useContext(ControlsContext)
}

export { ControlsContext }
export default useControls
