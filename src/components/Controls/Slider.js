import React, { useRef } from 'react'
import { Range, RangeBackground, RangeThumb } from './style'
import Emoji from '../Shared/Emoji'

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

  const handleMouseUp = ({ clientX }) => {
    handleMouseMove({ clientX })
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('touchend', handleMouseMove)
  }

  const handleMouseDown = ({ clientX }) => {
    diff.current = clientX - thumbRef.current.getBoundingClientRect().left
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }

  const percentage = value / (max - min) * 100

  return (
    <Range ref={rangeRef}>
      <RangeBackground
        style={{
          background: `hsl(0, 0%, ${percentage}%)`,
          width: `calc(${percentage}% + 1rem)`
        }}
      />
      <RangeThumb ref={thumbRef}
        onTouchStart={handleMouseDown}
        onMouseDown={handleMouseDown}
        style={{
          left: `calc(${percentage}% - 5px)`
        }}
      >
        <Emoji emoji={emoji} label={label} />
      </RangeThumb>
    </Range>
  )
}

export default Slider