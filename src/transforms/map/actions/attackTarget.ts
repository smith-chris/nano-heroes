import { getAllCreatures, getSelectedCreature, setPreviousCreature } from '../map'
import { Battle, Id } from '../types'
import { hit } from '../../creature'

export const attackTargetStart = (battle: Battle, id: Id) => {
  const target = getAllCreatures(battle)[id]
  const selected = getSelectedCreature(battle)
  if (!target || !selected) {
    console.warn(
      `${!target ? 'Target' : 'Selected'} is not available in state: `,
      battle,
    )
    return {}
  } else {
    const [incomingData] = hit({
      defender: target,
      attacker: selected,
    })
    return {
      target: {
        id,
        incomingData,
      },
    }
  }
}

export const attackTargetEnd = (battle: Battle) => {
  if (!battle.target.incomingData) {
    return battle
  }
  return {
    ...setPreviousCreature(battle, battle.target.incomingData),
    target: {},
  }
}
