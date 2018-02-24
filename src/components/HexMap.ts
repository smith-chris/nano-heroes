import { Sprite, Container } from 'pixi.js'
import { idToPoint, findPath, Hexes } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import grassImage from 'assets/grass.png'
import stoneImage from 'assets/stone.png'
const images = {
  grass: grassImage.src,
  stone: stoneImage.src
}

export const HexMap = (hexes: Hexes) => {
  const result = new Container()
  Object.keys(hexes).map(key => {
    let val = hexes[key]
    let position = idToPoint(key)
    let src = images[val.type]
    const hexSprite = Sprite.fromImage(src)
    hexSprite.anchor.set(0.5)
    Object.assign(hexSprite.position, pointToCoordinates(position))
    result.addChild(hexSprite)
  })
  return result
}
