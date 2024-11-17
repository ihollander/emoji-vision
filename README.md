# [EmojiVision](https://emoji.video) 📷

_See the world through emoji-colored glasses_

![screenshot](screenshots/emojivision.png?raw=true)

Emoji are great! Who wouldn't want to live in a world made entirely of emoji? This humble project takes us one step closer to that goal. See it at [emoji.video](https://emoji.video)

## Details

The general flow of information in this project is as follows:

- Generate a color palette by iterating over a list of emoji characters, drawing each one to a `<canvas>` element, and finding the [dominant color](https://github.com/olivierlesnicki/quantize)
- Access the user's webcam and stream the video to an intermediary `<canvas>` element that has been reduced in size
- For each frame of video (or as often as possible):
  - Using the intermediary canvas, perform [color quantization](https://github.com/leeoniya/RgbQuant.js/) to reduce the palette colors in the image to match our pre-build emoji color palette
  - With the pixel data from the intermediary canvas, find the emoji in our palette that matches the pixel color and draw that emoji on the final canvas

## Future Improvements

- Currently uses 2D canvas context to process video and quantize colors, this may be improved using WebGL
- The initial palette is generated using a fixed set of emoji based on the top 500 emoji in the [list of most frequently used characters](https://home.unicode.org/emoji/emoji-frequency/); as an alternate approach, we could map a larger list of emoji to a pre-defined 256 color palette to ensure a fuller range of colors and smaller emoji set

## Resources

- http://www.leptonica.org/color-quantization.html
