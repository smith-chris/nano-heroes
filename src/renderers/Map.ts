import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Hexes } from 'transforms/Map'
import { renderHexes } from 'renderers/Hexes'
import { pointToCoordinates } from 'utils'
import { Creature } from 'transforms/Creature'
import { store } from 'store/store'
import { battleActions } from 'store/battle'

const handleCreatureClick = (creature: Creature) => {
  store.dispatch(battleActions.selectCreature(creature.position))
}

const renderCreatures = (hexes: Hexes) => {
  let result = new Container()
  for (let key in hexes) {
    const { occupant } = hexes[key]
    if (occupant instanceof Creature) {
      const creatureSprite = Sprite.fromImage(char1.src)
      result.addChild(creatureSprite)
      creatureSprite.anchor.x = 0.5
      creatureSprite.anchor.y = 1
      Object.assign(
        creatureSprite.position,
        pointToCoordinates(occupant.position)
      )
      creatureSprite.position.y += 1
      creatureSprite.interactive = true
      creatureSprite.on('pointerdown', handleCreatureClick.bind(null, occupant))
    } else if (occupant) {
      console.warn('This is not instance of Creature', occupant)
    }
  }
  return result
}

export const renderMap = () => {
  const { battle } = store.getState()
  const result = new Container()
  result.x = 2 + 8
  result.y = 2 + 4

  const hexes = renderHexes(battle.hexes)
  result.addChild(hexes)

  result.addChild(renderCreatures(battle.hexes))

  return result
}
