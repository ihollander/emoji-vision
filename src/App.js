import React, { useState, useRef } from 'react';
import PaletteBuilder from './components/PaletteBuilder/index'
import EmojiVision from './components/EmojiVision'
import Controls from './components/Controls'
import Modal from './components/Modal'
import Navbar from './components/Navbar'
import { useMediaDeviceInfo, usePaletteBuilder } from './hooks';
import * as paletteBuilderStatus from './constants/paletteBuilder'

import emoji from './emoji.json'
const lessEmoji = emoji.slice(0, 500).join("")

function App() {
  // emoji array used to build palette
  const [emoji, setEmoji] = useState(lessEmoji)
  const { palette, paletteColors, status: paletteStatus } = usePaletteBuilder(emoji)

  // video settings
  const [debug, setDebug] = useState(false)
  const [fontSize, setFontSize] = useState(10)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState("user")

  // device info
  const { videoDevices } = useMediaDeviceInfo()

  // App UI state
  const [activeModal, setActiveModal] = useState("CONTROLS")

  const canvasRef = useRef()


  // Render helpers
  const getModalContents = () => {
    switch (activeModal) {
      case "CONTROLS":
        return <Controls
          fontSize={fontSize} setFontSize={setFontSize}
          contrast={contrast} setContrast={setContrast}
          saturate={saturate} setSaturate={setSaturate}
          brightness={brightness} setBrightness={setBrightness}
        />
      case "PALETTE":
        return <PaletteBuilder emoji={emoji} setEmoji={setEmoji} />
      default:
        return null
    }
  }

  return (
    <div className="App">
      <Navbar
        canvasRef={canvasRef}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        debug={debug}
        setDebug={setDebug}
        videoDeviceCount={videoDevices.length}
      />
      {/* style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }} */}
      <main>
        {paletteStatus === paletteBuilderStatus.READY && <EmojiVision
          canvasRef={canvasRef}
          debug={debug}
          palette={palette}
          paletteColors={paletteColors}
          fontSize={fontSize}
          brightness={brightness}
          saturate={saturate}
          contrast={contrast}
          facingMode={facingMode}
        />}
        <Modal setActiveModal={setActiveModal} show={activeModal !== "NONE"}>
          {getModalContents()}
        </Modal>
      </main>
    </div>
  )
}

export default App;
