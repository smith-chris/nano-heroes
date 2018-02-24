import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Hexes } from 'transforms/Map'
import { renderHexes } from 'renderers/Hexes'
import { pointToCoordinates } from 'utils'
import { Creature } from 'transforms/Creature'

const renderCreatures = (hexes: Hexes) => {
  let result = new Container()
  for (let key in hexes) {
    const { occupant } = hexes[key]
    if (occupant instanceof Creature) {
      const creatureSprite = Sprite.fromImage(char1.src)
      creatureSprite.anchor.x = 0.5
      creatureSprite.anchor.y = 1
      Object.assign(
        creatureSprite.position,
        pointToCoordinates(occupant.position)
      )
      creatureSprite.position.y += 1
      result.addChild(creatureSprite)
    } else if (occupant) {
      console.warn('This is not instance of Creature', occupant)
    }
  }
  return result
}

export const renderMap = (store: StoreState) => {
  const { battle } = store
  const result = new Container()
  result.x = 2 + 8
  result.y = 2 + 4

  const hexes = renderHexes(battle.hexes)
  result.addChild(hexes)

  result.addChild(renderCreatures(battle.hexes))

  return result
}
