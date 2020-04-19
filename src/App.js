import React, { useState, useRef, useEffect } from 'react';
import PaletteBuilder from './components/PaletteBuilder/index'
import EmojiVision from './components/EmojiVision'
import Controls from './components/Controls'
import Modal from './components/Modal'
import Navbar from './components/Navbar'

function App() {
  const [palette, setPalette] = useState(null)
  const [resolution, setResolution] = useState("10")
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")

  const [activeModal, setActiveModal] = useState("NONE")

  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const vWidth = Math.min(Math.max(width, 480), 960)
  const vHeight = Math.min(Math.max(height, 480), 960)

  const handleResizeWindow = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResizeWindow)

    return () => {
      window.removeEventListener("resize", handleResizeWindow)
    }
  }, [])

  const getModalContents = () => {
    switch (activeModal) {
      case "CONTROLS":
        return <Controls
          resolution={resolution} setResolution={setResolution}
          contrast={contrast} setContrast={setContrast}
          saturate={saturate} setSaturate={setSaturate}
          brightness={brightness} setBrightness={setBrightness}
        />
      case "PALETTE":
        return <PaletteBuilder palette={palette} setPalette={setPalette} />
      default:
        return null
    }
  }

  return (
    <div className="App">
      <Navbar activeModal={activeModal} setActiveModal={setActiveModal} />
      <main style={{ position: "relative" }}>
        {palette && <EmojiVision
          palette={palette}
          resolution={resolution}
          filters={{ brightness, saturate, contrast }}
          width={vWidth}
          height={vHeight}
        />}
        {/* <div style={{ width: "100%", height: "50vh", backgroundColor: "rebeccapurple" }} /> */}
        <Modal show={activeModal !== "NONE"}>
          {getModalContents()}
        </Modal>
      </main>
    </div>
  )
}

export default App;
