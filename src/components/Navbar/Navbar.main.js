import React, { useRef } from 'react'
import { Header, Logo, Nav, Button } from './style'

const Emoji = ({ character, title }) => (
  <span role="img" aria-label={title}>{character}</span>
)

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
        <Emoji title="Camera" character="📷" />
      </Logo>
      <Nav>
        {videoDeviceCount > 1 && <Button onClick={() => setFacingMode(facingMode === "user" ? "enviromnent" : "user")}>
          <Emoji title="Reverse" character={facingMode === "user" ? "🙃" : "🙂"} />
        </Button>}
        <Button onClick={() => setActiveModal(activeModal === "PALETTE" ? "NONE" : "PALETTE")}>
          <Emoji title="Palette" character="🎨" />
        </Button>
        <Button onClick={() => setActiveModal(activeModal === "CONTROLS" ? "NONE" : "CONTROLS")}>
          <Emoji title="Wrench" character="🔧" />
        </Button>
        <Button onClick={() => setDebug(!debug)}>
          <Emoji title="Palette" character={debug ? "🦋" : "🐛"} />
        </Button>
      </Nav>
    </Header>
  )
}

export default Navbar