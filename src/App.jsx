import { useEffect, useRef } from "react"
import ReactGA from "react-ga4"

import ControlsProvider from "./components/ControlsProvider"
import EmojiVision from "./components/EmojiVision"
import Navbar from "./components/Navbar"
import PaletteProvider from "./components/PaletteProvider"

function App() {
  // canvas for EmojiVision + image downloader in NavBar
  const canvasRef = useRef()

  useEffect(() => {
    ReactGA.initialize("UA-164891713-1")
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    })
  }, [])

  return (
    <ControlsProvider>
      <PaletteProvider>
        <Navbar canvasRef={canvasRef} />
        <EmojiVision canvasRef={canvasRef} />
      </PaletteProvider>
    </ControlsProvider>
  )
}

export default App
