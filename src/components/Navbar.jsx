import { useRef } from "react"

import { useEmojiFavicon, useVideoDeviceInfo } from "../hooks"
import useControls from "../hooks/useControls"
import usePalette from "../hooks/usePalette"
import downloadImage from "../utils/download"
import Controls from "./Controls"
import Modal from "./Modal"
import { Button, ButtonLink, Emoji } from "./Shared"

const Navbar = ({ canvasRef }) => {
  const { palette, updatePalette } = usePalette()
  const textareaRef = useRef()

  const videoInputDevices = useVideoDeviceInfo()

  const { facingMode, setFacingMode } = useControls()

  const [logo, setLogo] = useEmojiFavicon("📷")

  const handleCameraClick = () => {
    setLogo("📸")
    downloadImage(canvasRef.current)
    setTimeout(() => setLogo("📷"), 1000) // just pretend this took 1 second to download
  }

  const handleFaceClick = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user")
  }

  const handlePaletteModalClose = () => {
    updatePalette(textareaRef.current.value)
  }

  return (
    <footer className="bg-transparent fixed bottom-0 flex w-full items-center justify-between px-4 py-3">
      <Button onClick={handleCameraClick}>
        <Emoji label="Camera" emoji={logo} />
      </Button>
      <nav className="flex gap-2">
        {videoInputDevices.length > 1 ? (
          <Button onClick={handleFaceClick}>
            <Emoji
              label="Change Camera"
              emoji={facingMode === "user" ? "🙃" : "🙂"}
            />
          </Button>
        ) : null}
        <Modal emoji="🎨" label="Palette" onClose={handlePaletteModalClose}>
          <textarea
            name="palette"
            autoComplete="false"
            className="h-[28rem] w-full resize-none bg-white text-lg"
            defaultValue={palette.emoji}
            ref={textareaRef}
          />
        </Modal>
        <Modal emoji="🔧" label="Settings">
          <Controls />
        </Modal>
        <ButtonLink
          href="https://github.com/ihollander/emoji-vision"
          target="_blank"
          rel="noreferrer"
        >
          <Emoji label="about" emoji="🤔" />
        </ButtonLink>
      </nav>
    </footer>
  )
}

export default Navbar
