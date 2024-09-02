const Emoji = ({ emoji, label }) => (
  <span role="img" aria-label={label} className="select-none">
    {emoji}
  </span>
)

export default Emoji
