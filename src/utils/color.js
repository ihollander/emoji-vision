export const colorToNumber = (r, g, b) => (r << 16) + (g << 8) + b

export const numberToColor = (number) => {
  if (typeof number === "string") {
    number = parseInt(number, 10)
  }

  return [
    (number & 0xff0000) >> 16,
    (number & 0x00ff00) >> 8,
    number & 0x0000ff,
  ]
}
