import { Sprite, Container } from 'pixi.js'
import { idToPoint, Hexes } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import grassImage from 'assets/grass.png'
import stoneImage from 'assets/stone.png'
import { subscribe } from 'store/store'
import { SpriteMap } from 'utils/pixi'

const images = {
  grass: grassImage.src,
  stone: stoneImage.src
}

export const HexMap = (hexes: Hexes) => {
  const result = new Container()
  const spriteMap: SpriteMap = {}
  Object.keys(hexes).map(key => {
    let val = hexes[key]
    let position = idToPoint(key)
    let src = images[val.type]
    const hexSprite = Sprite.fromImage(src)
    hexSprite.anchor.set(0.5)
    Object.assign(hexSprite.position, pointToCoordinates(position))
    result.addChild(hexSprite)
    spriteMap[key] = hexSprite
  })
  subscribe<Hexes>(
    s => s.battle.hexes,
    newHexes => {
      for (const key in newHexes) {
        const hex = newHexes[key]
        if (hex.path.length > 0) {
          spriteMap[key].alpha = 0.5
        } else {
          spriteMap[key].alpha = 1
        }
      }
    }
  )
  return result
}
