import { Text } from 'pixi.js'

const font = {
  size: 55,
  stroke: 0.39,
  scale: 0.5 * 10,
  lineHeight: 1.8
}
export const BitmapText = (text: string) => {
  const result = new Text(text, {
    fontFamily: 'Pico',
    fontSize: font.size,
    lineHeight: font.lineHeight * font.size,
    fill: 0xffffff,
    stroke: 0x000000,
    strokeThickness: font.size * font.stroke
  })
  result.scale.set(font.scale / font.size)
  return result
}
