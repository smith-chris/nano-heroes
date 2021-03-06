import { Texture } from 'pixi.js'
import grass from 'assets/grass.png'
import grassRed from 'assets/grassRed.png'
import grassRedRing from 'assets/grassRedRing.png'
import grassRedDark from 'assets/grassRedDark.png'
import grassDark from 'assets/grassDark.png'
import stone from 'assets/stone.png'

const toTextures = <T>(txts: T) =>
  Object.entries(txts).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: Texture.fromImage(value.src) }),
    {},
  ) as { [K in keyof T]: Texture }

export const terrain = toTextures({
  grass,
  stone,
  grassRed,
  grassDark,
  grassRedRing,
  grassRedDark,
})
