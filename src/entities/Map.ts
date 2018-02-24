import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Map, idToPoint, findPath, pointToId, Point } from 'transforms/Map'
import { renderHexes } from 'entities/Hexes'
import { pointToCoordinates, hexToCoordinates } from 'utils'
import { Creature } from 'transforms/Creatures'

const renderCreatures = (creatures: Creature[]) => {
  let result = new Container()
  for (let creature of creatures) {
    if (creature instanceof Creature) {
      const creatureSprite = Sprite.fromImage(char1.src)
      creatureSprite.anchor.x = 0.5
      creatureSprite.anchor.y = 1
      Object.assign(
        creatureSprite.position,
        pointToCoordinates(creature.position)
      )
      creatureSprite.position.y += 1
      result.addChild(creatureSprite)
    } else {
      console.warn('This is not instance of Creature', creature)
    }
  }
  return result
}

export const renderMap = (store: StoreState) => {
  const { map } = store
  const result = new Container()
  result.x = 2 + 8
  result.y = 2 + 4

  const hexes = renderHexes(map.hexes)
  result.addChild(hexes)

  result.addChild(renderCreatures(map.attackers))
  result.addChild(renderCreatures(map.defenders))

  return result
}
