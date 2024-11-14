import { useState } from "react"

import { ControlsContext } from "../hooks/useControls"

const ControlsProvider = ({ children }) => {
  const [debug, setDebug] = useState(false)
  // TODO: why is video cut off on fontSize 4???
  // seems maybe to be at crop/resize stage...
  const [fontSize, setFontSize] = useState(8)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState("user")

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
