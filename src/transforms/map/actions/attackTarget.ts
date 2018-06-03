import { getSelectedCreature } from '../map'
import { Battle, Id } from '../types'
import { hit, getCount } from '../../creature'
import { removeElement } from './utils'

export const attackTargetStart = (battle: Battle, id: Id) => {
  const target = battle.creatures[id]
  const selected = getSelectedCreature(battle)
  if (!target || !selected) {
    console.warn(
      `${!target ? 'Target' : 'Selected'} is not available in state: `,
      battle,
    )
    return {}
  } else {
    const [incomingHealth] = hit({
      attacker: selected,
      defender: target,
    })
    return {
      target: {
        id,
        incomingHealth,
      },
    }
  }
}

export const attackTargetEnd = (battle: Battle) => {
  const { target, creatures } = battle
  if (!target.incomingHealth) {
    console.warn('No incomingHealth!', battle)
    return battle
  }
  if (!target.id) {
    console.warn('No target.id!', battle)
    return battle
  }

  const newCreatures = { ...creatures }

  newCreatures[target.id] = {
    ...newCreatures[target.id],
    health: target.incomingHealth,
  }

  return {
    creatures: newCreatures,
    target: {},
  }
}
