import React, { useState } from 'react';
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
  const [fontSize, setFontSize] = useState(10)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState("user")

  // device info
  const { videoDevices } = useMediaDeviceInfo()

  // App UI state
  const [activeModal, setActiveModal] = useState("NONE")

  // this needs work...
  // useEffect(() => {
  //   let width = 640
  //   let height = 480
  //   setConstraints({
  //     video: {
  //       width: { max: width / fontSize },
  //       height: { max: height / fontSize },
  //       facingMode
  //     }
  //   })
  // }, [orientation, fontSize, facingMode])


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
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        videoDeviceCount={videoDevices.length}
      />
      <main style={{ position: "relative", minHeight: "80vh" }}>
        {paletteStatus === paletteBuilderStatus.READY && <EmojiVision
          palette={palette}
          paletteColors={paletteColors}
          fontSize={fontSize}
          filters={{ brightness, saturate, contrast }}
          facingMode={facingMode}
        />}
        <Modal show={activeModal !== "NONE"}>
          {getModalContents()}
        </Modal>
      </main>
    </div>
  )
}

export default App;
