import { useEffect, useState } from "react"

import { useEmojiFavicon, useVideoDeviceInfo } from "../hooks"
import useControls from "../hooks/useControls"
import Controls from "./Controls"
import Modal from "./Modal"
import PaletteBuilder from "./PaletteBuilder"
import { Button, ButtonLink, Emoji } from "./Shared"

const Navbar = ({ canvasRef }) => {
  const videoInputDevices = useVideoDeviceInfo()

  const { facingMode, setFacingMode } = useControls()

  const [logo, setLogo] = useEmojiFavicon("📷")
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (isDownloading) {
      // create background canvas so we don't end up with transparent background
      const bgCanvas = document.createElement("canvas")
      bgCanvas.width = canvasRef.current.width
      bgCanvas.height = canvasRef.current.height

      const ctx = bgCanvas.getContext("2d")
      ctx.fillStyle = "#FFF8E7"
      ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
      ctx.drawImage(canvasRef.current, 0, 0)

      const link = document.createElement("a")
      document.body.append(link)
      link.download = "emojivision.png"
      link.href = bgCanvas.toDataURL()
      link.click()
      link.remove()

      setLogo("📷")
      setIsDownloading(false)
    }
  }, [canvasRef, isDownloading, setLogo])

  const handleCameraClick = () => {
    setLogo("📸")
    setIsDownloading(true)
  }

  const handleFaceClick = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user")
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
        <Modal emoji="🎨" label="Palette">
          <PaletteBuilder />
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
