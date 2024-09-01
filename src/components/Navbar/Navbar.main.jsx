import { useRef } from 'react'

import * as modalConsts from '../../constants/modal'
import { useEmojiFavicon } from '../../hooks'
import { Button,Emoji } from '../Shared'
import { Header, Logo, Nav } from './style'

const Navbar = ({
  canvasRef,
  activeModal, setActiveModal,
  facingMode, setFacingMode,
  videoDeviceCount
}) => {
  // favicon for funsiez
  const [logo, setLogo] = useEmojiFavicon("📷")
  const logoRef = useRef()

  const handleClick = () => {
    // create background canvas so we don't end up with transparent background
    const bgCanvas = document.createElement("canvas")
    bgCanvas.width = canvasRef.current.width
    bgCanvas.height = canvasRef.current.height

    const ctx = bgCanvas.getContext("2d")
    ctx.fillStyle = "#FFF8E7"
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
    ctx.drawImage(canvasRef.current, 0, 0)

    const link = logoRef.current
    link.download = "emojivision.png"
    link.href = bgCanvas.toDataURL()
    setLogo("📷")
  }

  return (
    <Header>
      <Logo
        ref={logoRef}
        onClick={handleClick}
        onTouchStart={() => setLogo("📸")}
        onMouseDown={() => setLogo("📸")}
        onTouchEnd={handleClick}
        onMouseUp={handleClick}
      >
        <Button>
          <Emoji label="Camera" emoji={logo} />
        </Button>
      </Logo>
      <Nav>
        {videoDeviceCount > 1 && <Button onClick={() => setFacingMode(facingMode === "user" ? "enviromnent" : "user")}>
          <Emoji label="Reverse" emoji={facingMode === "user" ? "🙃" : "🙂"} />
        </Button>}
        <Button onClick={() => setActiveModal(activeModal === modalConsts.PALETTE ? modalConsts.NONE : modalConsts.PALETTE)}>
          <Emoji label="Palette" emoji="🎨" />
        </Button>
        <Button onClick={() => setActiveModal(activeModal === modalConsts.CONTROLS ? modalConsts.NONE : modalConsts.CONTROLS)}>
          <Emoji label="Wrench" emoji="🔧" />
        </Button>
        <a href="https://github.com/ihollander/emoji-vision">
          <Button>
            <Emoji label="about" emoji="🤔" />
          </Button>
        </a>
      </Nav>
    </Header>
  )
}

export default Navbar
