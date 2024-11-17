import { useState } from "react"

import * as facingModes from "../constants/facingMode"
import { ControlsContext } from "../hooks/useControls"

const ControlsProvider = ({ children }) => {
  const [debug, setDebug] = useState(false)
  const [fontSize, setFontSize] = useState(8)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState(facingModes.USER)

  return (
    <ControlsContext.Provider
      value={{
        debug,
        setDebug,
        fontSize,
        setFontSize,
        contrast,
        setContrast,
        saturate,
        setSaturate,
        brightness,
        setBrightness,
        facingMode,
        setFacingMode,
      }}
    >
      {children}
    </ControlsContext.Provider>
  )
}

export default ControlsProvider
