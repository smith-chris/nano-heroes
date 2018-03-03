import { Sprite, Container, ticker } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Hexes, each, Creatures, Id, Point } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import { Creature } from 'transforms/creature'
import { store, subscribe } from 'store/store'
import { battleActions } from 'store/battle'
import { SpriteMap } from 'utils/pixi'

const creatureTicker = new ticker.Ticker()

const handleCreatureClick = (creatureId: Id) => {
  store.dispatch(battleActions.selectCreature(creatureId))
}

const updateSprite = (sprite: Sprite, creature: Creature) => {
  Object.assign(sprite.position, pointToCoordinates(creature.position))
  sprite.position.y += 1
}

const spriteMap: SpriteMap = {}

export const events = {
  moveCreature: () => Promise.resolve({})
}

const moveCreature = () => {
  const { selected: { id, path }, creatures } = store.getState().battle
  const sprite = spriteMap[id]
  const from = pointToCoordinates(creatures[id].position)
  const to = pointToCoordinates(path[path.length - 1].position)
  const width = to.x - from.x
  const height = to.y - from.y
  let progress = 0
  const end = 60
  return new Promise((resolve, reject) => {
    let that = () => {
      if (++progress > end) {
        creatureTicker.remove(that)
        resolve()
        return
      }
      sprite.position.x = Math.round(from.x + width * (progress / end))
      sprite.position.y = Math.round(from.y + height * (progress / end))
    }
    creatureTicker.add(that)
    creatureTicker.start()
  })
}

export const CreatureMap = (creatures: Creatures) => {
  let result = new Container()
  each(creatures, creature => {
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
    s => s.battle.selected.path,
    path => {
      if (path && path.length > 0) {
        const promise = moveCreature()
        events.moveCreature = () => promise
      } else {
        delete events.moveCreature
      }
    }
  )
  subscribe(
    s => s.battle.creatures,
    newCreatures => {
      each(newCreatures, creature => {
        // TODO: Animate creatures
        const sprite = spriteMap[creature.id]
        updateSprite(sprite, creature)
      })
    }
  )
  return result
}
