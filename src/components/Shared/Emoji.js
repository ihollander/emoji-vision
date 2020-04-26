import React from 'react'

const Emoji = ({ emoji, label }) => (
  <span role="img" aria-label={label}>{emoji}</span>
)

export default Emoji
