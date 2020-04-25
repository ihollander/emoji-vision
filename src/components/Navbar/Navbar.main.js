import React from 'react'
import { Header, Logo, Nav, Button } from './style'

const Emoji = ({ character, title }) => (
  <span role="img" aria-label={title}>{character}</span>
)

const Navbar = ({
  activeModal, setActiveModal,
  facingMode, setFacingMode,
  videoDeviceCount
}) => {
  return (
    <Header>
      <Logo>
        <Emoji title="Camera" character="📷" />
      </Logo>
      <Nav>
        <Button onClick={() => setActiveModal(activeModal === "PALETTE" ? "NONE" : "PALETTE")}>
          <Emoji title="Palette" character="🎨" />
        </Button>
        <Button onClick={() => setActiveModal(activeModal === "CONTROLS" ? "NONE" : "CONTROLS")}>
          <Emoji title="Wrench" character="🔧" />
        </Button>
        {videoDeviceCount > 1 && <Button onClick={() => setFacingMode(facingMode === "user" ? "enviromnent" : "user")}>
          <Emoji title="Reverse" character={facingMode === "user" ? "🙃" : "🙂"} />
        </Button>}
      </Nav>
    </Header>
  )
}

export default Navbar