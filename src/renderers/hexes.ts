import { Sprite, Container } from 'pixi.js'
import Map, { idToPoint, findPath, pointToId, Hexes, Point } from 'entities/Map'
import { pointToCoordinates } from 'utils'
import grassImage from 'assets/grass.png'
import stoneImage from 'assets/stone.png'
const images = {
  grass: grassImage.src,
  stone: stoneImage.src
}

export default (hexes: Hexes) => {
  const result = new Container()
  Object.keys(hexes).map(key => {
    let val = hexes[key]
    let position = idToPoint(key)
    let src = images[val.type]
    const hexSprite = Sprite.fromImage(src)
    Object.assign(hexSprite.position, pointToCoordinates(position))
    result.addChild(hexSprite)
  })
  return result
}
