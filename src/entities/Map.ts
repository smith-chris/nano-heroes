import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Map, idToPoint, findPath, pointToId, Point } from 'transforms/Map'
import { renderHexes } from 'entities/Hexes'
import { pointToCoordinates } from 'utils'

export const renderMap = (map: Map) => {
  // create a new Sprite from an image path
  const character = Sprite.fromImage(char1.src)
  const result = new Container()
  const hexes = renderHexes(map.hexes)

  result.x = 2 + 8
  result.y = 2 + 4

  // center the sprite's anchor point

  // move the sprite to the center of the screen
  character.anchor.x = 0.5
  character.anchor.y = 1
  Object.assign(character.position, pointToCoordinates(new Point(0, 0)))
  character.position.y += 1

  result.addChild(hexes)
  result.addChild(character)
  return result
}
