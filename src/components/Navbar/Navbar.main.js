import React, { useRef } from 'react'
import { Emoji, Button } from '../Shared'
import { Header, Logo, Nav } from './style'
import { useEmojiFavicon } from '../../hooks'
import * as modalConsts from '../../constants/modal'

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
        <Button onClick={() => setDebug(!debug)}>
          <Emoji label="Palette" emoji={debug ? "🦋" : "🐛"} />
        </Button>
      </Nav>
    </Header>
  )
}

export default Navbar