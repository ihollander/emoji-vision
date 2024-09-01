import { useEffect, useRef, useState } from "react"
import ReactGA from "react-ga4"

import Controls from "./components/Controls"
import EmojiVision from "./components/EmojiVision/EmojiVision.main"
import Modal from "./components/Modal"
import Navbar from "./components/Navbar"
import PaletteBuilder from "./components/PaletteBuilder/index"
import * as modalConsts from "./constants/modal"
import emoji from "./emoji.json"
import { useLocalStorage, useMediaDeviceInfo, usePaletteBuilder } from "./hooks"

const lessEmoji = emoji.slice(0, 500).join("")

function App() {
  // emoji array used to build palette
  const [emoji, setEmoji] = useLocalStorage("emojiList", lessEmoji)
  const { palette, paletteColors } = usePaletteBuilder(emoji)

  // video settings
  const [debug, setDebug] = useState(false)
  const [fontSize, setFontSize] = useState(8)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState("user")

  // device info
  const { videoInputDevices } = useMediaDeviceInfo()

  // App UI state
  const [activeModal, setActiveModal] = useState(modalConsts.NONE)

  // canvas for EmojiVision + image downloader in NavBar
  const canvasRef = useRef()

  useEffect(() => {
    ReactGA.initialize("UA-164891713-1")
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    })
  }, [])

  // Render helpers
  const getModalContents = () => {
    switch (activeModal) {
      case modalConsts.CONTROLS:
        return (
          <Controls
            fontSize={fontSize}
            setFontSize={setFontSize}
            contrast={contrast}
            setContrast={setContrast}
            saturate={saturate}
            setSaturate={setSaturate}
            brightness={brightness}
            setBrightness={setBrightness}
            debug={debug}
            setDebug={setDebug}
          />
        )
      case modalConsts.PALETTE:
        return <PaletteBuilder emoji={emoji} setEmoji={setEmoji} />
      default:
        return null
    }
  }

  return (
    <>
      <Navbar
        canvasRef={canvasRef}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        videoDeviceCount={videoInputDevices.length}
      />
      <main style={{ display: "flex", height: "92vh", alignItems: "center" }}>
        <EmojiVision
          canvasRef={canvasRef}
          debug={debug}
          palette={palette}
          paletteColors={paletteColors}
          fontSize={fontSize}
          brightness={brightness}
          saturate={saturate}
          contrast={contrast}
          facingMode={facingMode}
        />
      </main>
      <Modal
        setActiveModal={setActiveModal}
        show={activeModal !== modalConsts.NONE}
      >
        {getModalContents()}
      </Modal>
    </>
  )
}

export default App
