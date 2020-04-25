import React, { useState, useEffect } from 'react';
import PaletteBuilder from './components/PaletteBuilder/index'
import EmojiVision from './components/EmojiVision'
import Controls from './components/Controls'
import Modal from './components/Modal'
import Navbar from './components/Navbar'
import { useDeviceDimensions } from './hooks';

function App() {
  const [palette, setPalette] = useState(null)
  const [fontSize, setFontSize] = useState(10)
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")
  const [facingMode, setFacingMode] = useState("user")
  const { orientation, videoDeviceCount } = useDeviceDimensions()

  const [activeModal, setActiveModal] = useState("NONE")

  const [constraints, setConstraints] = useState(null)

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
        return <PaletteBuilder palette={palette} setPalette={setPalette} />
      default:
        return null
    }
  }

  useEffect(() => {
    let width = 640
    let height = 480

    // if (orientation === "portrait") {
    //   width = 640
    //   height = 640
    // }

    setConstraints({
      video: {
        width: { max: width / fontSize },
        height: { max: height / fontSize },
        facingMode
      }
    })
  }, [orientation, fontSize, facingMode])

  return (
    <div className="App">
      <Navbar
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        facingMode={facingMode}
        setFacingMode={setFacingMode}
        videoDeviceCount={videoDeviceCount}
      />
      <main style={{ position: "relative", minHeight: "80vh" }}>
        {constraints && palette && <EmojiVision
          palette={palette}
          fontSize={fontSize}
          mirror={facingMode === "user"}
          facingMode={facingMode}
          constraints={constraints}
          filters={{ brightness, saturate, contrast }}
          orientation={orientation}
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
