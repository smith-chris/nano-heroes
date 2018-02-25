import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Hexes, everyCreature, Creatures, Id } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import { Creature } from 'transforms/creature'
import { store, subscribe } from 'store/store'
import { battleActions } from 'store/battle'
import { SpriteMap } from 'utils/pixi'

const handleCreatureClick = (creatureId: Id) => {
  store.dispatch(battleActions.selectCreature(creatureId))
}

const updateSprite = (sprite: Sprite, creature: Creature) => {
  Object.assign(sprite.position, pointToCoordinates(creature.position))
  sprite.position.y += 1
}

export const CreatureMap = (creatures: Creatures) => {
  let result = new Container()
  const spriteMap: SpriteMap = {}
  everyCreature(creatures, creature => {
    const sprite = Sprite.fromImage(char1.src)
    result.addChild(sprite)
    spriteMap[creature.id] = sprite
    sprite.anchor.x = 0.5
    sprite.anchor.y = 1
    sprite.interactive = true
    sprite.on('pointerdown', handleCreatureClick.bind(null, creature.id))
    updateSprite(sprite, creature)
  })
  subscribe(
    s => s.battle.creatures,
    newCreatures => {
      everyCreature(newCreatures, creature => {
        // TODO: Animate creatures
        const sprite = spriteMap[creature.id]
        updateSprite(sprite, creature)
      })
    }
  )
  return result
}
