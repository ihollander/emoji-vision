import React, { useRef } from 'react'
import Emoji from '../Shared/Emoji'
import { Header, Logo, Nav, Button } from './style'

const Navbar = ({
  canvasRef,
  activeModal, setActiveModal,
  facingMode, setFacingMode,
  debug, setDebug,
  videoDeviceCount
}) => {
  const logoRef = useRef()

  const handleDownload = () => {
    const link = logoRef.current
    link.download = 'emojivision.png'
    link.href = canvasRef.current.toDataURL()
  }

  return (
    <Header>
      <Logo onClick={handleDownload} ref={logoRef}>
        <Emoji label="Camera" emoji="📷" />
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