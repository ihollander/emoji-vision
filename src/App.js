import React, { useState } from 'react';
import PaletteBuilder from './components/PaletteBuilder'
import EmojiVision from './components/EmojiVision'
import Controls from './components/Controls'
import './App.css';

function App() {
  const [palette, setPalette] = useState(null)
  const [resolution, setResolution] = useState("10")
  const [contrast, setContrast] = useState("1.0")
  const [saturate, setSaturate] = useState("1.0")
  const [brightness, setBrightness] = useState("1.0")


  return (
    <div className="App">
      <EmojiVision
        palette={palette}
        resolution={resolution}
        filters={{ brightness, saturate, contrast }}
        width={960}
        height={540}
      />
      <Controls
        resolution={resolution} setResolution={setResolution}
        contrast={contrast} setContrast={setContrast}
        saturate={saturate} setSaturate={setSaturate}
        brightness={brightness} setBrightness={setBrightness}
      />
      <PaletteBuilder setPalette={setPalette} />
    </div>
  )
}

export default App;
