import React, { useState, useRef } from 'react';
import PaletteBuilder from './components/PaletteBuilder/index'
import EmojiVision from './components/EmojiVision/EmojiVision.main'
import Controls from './components/Controls'
import Modal from './components/Modal'
import Navbar from './components/Navbar'
import { useMediaDeviceInfo, usePaletteBuilder, useLocalStorage } from './hooks';
import * as paletteBuilderConsts from './constants/paletteBuilder'
import * as modalConsts from './constants/modal'

import emoji from './emoji.json'
const lessEmoji = emoji.slice(0, 500).join("")

function App() {
  // emoji array used to build palette
  const [emoji, setEmoji] = useLocalStorage('emojiList', lessEmoji)
  const { palette, paletteColors, status: paletteStatus } = usePaletteBuilder(emoji)

  // video settings
  const [debug, setDebug] = useState(false)
  const [fontSize, setFontSize] = useState(8)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState("user")

  // device info
  const { videoDevices } = useMediaDeviceInfo()

  // App UI state
  const [activeModal, setActiveModal] = useState(modalConsts.NONE)

  // canvas for EmojiVision + image downloader in NavBar
  const canvasRef = useRef()

  // Render helpers
  const getModalContents = () => {
    switch (activeModal) {
      case modalConsts.CONTROLS:
        return <Controls
          fontSize={fontSize} setFontSize={setFontSize}
          contrast={contrast} setContrast={setContrast}
          saturate={saturate} setSaturate={setSaturate}
          brightness={brightness} setBrightness={setBrightness}
        />
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
        debug={debug}
        setDebug={setDebug}
        videoDeviceCount={videoDevices.length}
      />
      <main style={{ position: "relative", margin: "2rem 0" }}>
        {paletteStatus === paletteBuilderConsts.READY && <EmojiVision
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
      </main>
      <Modal setActiveModal={setActiveModal} show={activeModal !== "NONE"}>
        {getModalContents()}
      </Modal>
    </>
  )
}

export default App;
