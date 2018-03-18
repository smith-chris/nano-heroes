import { Texture } from 'pixi.js'
import grass from 'assets/grass.png'
import stone from 'assets/stone.png'
import redGrass from 'assets/redGrass.png'

const toTextures = <T>(txts: T) =>
  Object.entries(txts).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: Texture.fromImage(value.src) }),
    {}
  ) as { [K in keyof T]: Texture }

export const terrain = toTextures({
  grass,
  stone,
  redGrass
})
