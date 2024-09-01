import React, { useRef } from 'react'

import Emoji from '../Shared/Emoji'
import { Range, RangeBackground, RangeThumb } from './style'

const Slider = ({
  emoji,
  label,
  value,
  onChange,
  min = 0.0,
  max = 1.0
}) => {
  const rangeRef = useRef()
  const thumbRef = useRef()

  const diff = React.useRef(0)

  const handleMouseMove = ({ clientX }) => {
    const start = 0
    const end = rangeRef.current.offsetWidth - thumbRef.current.offsetWidth

    let newX = clientX - diff.current - rangeRef.current.getBoundingClientRect().left
    if (newX < start) {
      newX = 0
    }
    if (newX > end) {
      newX = end
    }

    const pct = (100 * newX) / end
    const newValue = (pct / 100 * (max - min)).toFixed(1)
    onChange(newValue)
  }

  const handleTouchMove = ({ touches }) => {
    handleMouseMove({ clientX: touches[0].clientX })
  }

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('touchend', handleMouseUp)
  }

  const handleMouseDown = ({ clientX }) => {
    diff.current = clientX - thumbRef.current.getBoundingClientRect().left
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = ({ touches }) => {
    const { clientX } = touches[0]
    diff.current = clientX - thumbRef.current.getBoundingClientRect().left

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleMouseUp)
  }

  const percentage = value / (max - min) * 100

  return (
    <Range ref={rangeRef}>
      <RangeBackground
        style={{
          background: `hsl(0, 0%, ${percentage}%)`,
          width: `${percentage}%`
        }}
      />
      <RangeThumb ref={thumbRef}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        style={{
          left: `calc(${percentage}% - 1rem)`
        }}
      >
        <Emoji emoji={emoji} label={label} />
      </RangeThumb>
    </Range>
  )
}

export default Slider