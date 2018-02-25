import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Hexes } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import { Creature } from 'transforms/creature'
import { store, subscribe } from 'store/store'
import { battleActions } from 'store/battle'
import { SpriteMap } from 'utils/pixi'

const handleCreatureClick = (creature: Creature) => {
  store.dispatch(battleActions.selectCreature(creature))
}

export const Creatures = (hexes: Hexes) => {
  let result = new Container()
  const spriteMap: SpriteMap = {}
  for (let key in hexes) {
    const { occupant } = hexes[key]
    if (occupant instanceof Creature) {
      const creatureSprite = Sprite.fromImage(char1.src)
      result.addChild(creatureSprite)
      spriteMap[key] = creatureSprite
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
  subscribe(
    s => s.battle.hexes,
    newHexes => {
      // TODO: Animate creatures
      for (const key in newHexes) {
        const hex = newHexes[key]
      }
    }
  )
  return result
}
