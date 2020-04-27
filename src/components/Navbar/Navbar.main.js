import React, { useRef } from 'react'
import Emoji from '../Shared/Emoji'
import { Header, Logo, Nav, Button } from './style'
import { useEmojiFavicon } from '../../hooks'

const Navbar = ({
  canvasRef,
  activeModal, setActiveModal,
  facingMode, setFacingMode,
  debug, setDebug,
  videoDeviceCount
}) => {
  // favicon for funsiez
  const [logo, setLogo] = useEmojiFavicon("📷")
  const logoRef = useRef()

  const handleClick = () => {
    const link = logoRef.current
    link.download = 'emojivision.png'
    link.href = canvasRef.current.toDataURL()
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
        <Emoji label="Camera" emoji={logo} />
      </Logo>
      <Nav>
        {videoDeviceCount > 1 && <Button onClick={() => setFacingMode(facingMode === "user" ? "enviromnent" : "user")}>
          <Emoji label="Reverse" emoji={facingMode === "user" ? "🙃" : "🙂"} />
        </Button>}
        <Button onClick={() => setActiveModal(activeModal === "PALETTE" ? "NONE" : "PALETTE")}>
          <Emoji label="Palette" emoji="🎨" />
        </Button>
        <Button onClick={() => setActiveModal(activeModal === "CONTROLS" ? "NONE" : "CONTROLS")}>
          <Emoji label="Wrench" emoji="🔧" />
        </Button>
        <Button onClick={() => setDebug(!debug)}>
          <Emoji label="Palette" emoji={debug ? "🦋" : "🐛"} />
        </Button>
      </Nav>
    </Header>
  )
}

export default Navbar