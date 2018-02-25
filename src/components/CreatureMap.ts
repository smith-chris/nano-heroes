import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Hexes, everyCreature, Creatures } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import { Creature } from 'transforms/creature'
import { store, subscribe } from 'store/store'
import { battleActions } from 'store/battle'
import { SpriteMap } from 'utils/pixi'

const handleCreatureClick = (creature: Creature) => {
  store.dispatch(battleActions.selectCreature(creature))
}

export const CreatureMap = (creatures: Creatures) => {
  let result = new Container()
  const spriteMap: SpriteMap = {}
  everyCreature(creatures, creature => {
    const creatureSprite = Sprite.fromImage(char1.src)
    result.addChild(creatureSprite)
    spriteMap[creature.id] = creatureSprite
    creatureSprite.anchor.x = 0.5
    creatureSprite.anchor.y = 1
    Object.assign(
      creatureSprite.position,
      pointToCoordinates(creature.position)
    )
    creatureSprite.position.y += 1
    creatureSprite.interactive = true
    creatureSprite.on('pointerdown', handleCreatureClick.bind(null, creature))
  })
  subscribe(
    s => s.battle.creatures,
    newCreatures => {
      everyCreature(newCreatures, creature => {
        // TODO: Animate creatures
        const sprite = spriteMap[creature.id]
      })
    }
  )
  return result
}
