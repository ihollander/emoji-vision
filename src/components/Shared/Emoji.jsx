import React from 'react'
import { StyledEmoji } from './style'

const Emoji = ({ emoji, label }) => (
  <StyledEmoji role="img" aria-label={label}>{emoji}</StyledEmoji>
)

export default Emoji
