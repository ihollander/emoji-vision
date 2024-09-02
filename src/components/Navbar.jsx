import { useEffect, useState } from "react"

import * as modalConsts from "../constants/modal"
import { useEmojiFavicon } from "../hooks"
import { Button, ButtonLink, Emoji } from "./Shared"

const Navbar = ({
  canvasRef,
  activeModal,
  setActiveModal,
  facingMode,
  setFacingMode,
  videoDeviceCount,
}) => {
  // favicon for funsiez
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

  const handlePaletteClick = () => {
    setActiveModal(
      activeModal === modalConsts.PALETTE
        ? modalConsts.NONE
        : modalConsts.PALETTE,
    )
  }

  const handleSettingsClick = () => {
    setActiveModal(
      activeModal === modalConsts.CONTROLS
        ? modalConsts.NONE
        : modalConsts.CONTROLS,
    )
  }

  return (
    <header className="flex justify-between items-center bg-yellow px-4 py-3">
      <Button onClick={handleCameraClick}>
        <Emoji label="Camera" emoji={logo} />
      </Button>
      <nav className="flex gap-2">
        {videoDeviceCount > 1 ? (
          <Button onClick={handleFaceClick}>
            <Emoji
              label="Change Camera"
              emoji={facingMode === "user" ? "🙃" : "🙂"}
            />
          </Button>
        ) : null}
        <Button onClick={handlePaletteClick}>
          <Emoji label="Palette" emoji="🎨" />
        </Button>
        <Button onClick={handleSettingsClick}>
          <Emoji label="Wrench" emoji="🔧" />
        </Button>
        <ButtonLink
          href="https://github.com/ihollander/emoji-vision"
          target="_blank"
          rel="noreferrer"
        >
          <Emoji label="about" emoji="🤔" />
        </ButtonLink>
      </nav>
    </header>
  )
}

export default Navbar
