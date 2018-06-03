import { chooseOther, chooseRandom } from 'utils/battle'
import {
  getPlayer,
  setPlayer,
  getAllCreatures,
  getCurrentCreatures,
  canCreatureMove,
} from '../map'
import { PlayerType, Battle, Id } from '../types'
import { removeElement } from './utils'
import { higlightHexes } from '..'
import { getCount } from '../../creature'

const selectCreature = (battle: Battle, id: Id) => {
  const targetCreature = getAllCreatures(battle)[id]
  if (targetCreature) {
    const hexes = higlightHexes(battle, targetCreature.position)

    return {
      hexes,
      selected: {
        id,
      },
    }
  } else {
    console.warn('map.selectCreature() - could not find creature.')
    return {}
  }
}

// This is following this formula: http://heroes.thelazy.net/wiki/Combat
export const selectNextCreature = (battle: Battle, playerType?: PlayerType): Battle => {
  const allCreatures = getAllCreatures(battle)
  // Get creatures that can move this round, sorted by lowest Y pos and highest speed
  let availableCreatures = Object.values(allCreatures)
    .filter(canCreatureMove)
    .sort((a, b) => (a.position.y > b.position.y ? 0 : 1))
    .sort((a, b) => (a.model.speed > b.model.speed ? 0 : 1))
  // and remove those that have speed lower than fastest available creature
  availableCreatures = availableCreatures.filter(
    e => e.model.speed === availableCreatures[0].model.speed,
  )

  let nextCreature
  if (availableCreatures.length > 1) {
    // There are more than 1 creatures with the same, biggest speed value
    if (battle.lastMovedCreatureId) {
      // We're trying to pick creature of opposite player compared to one that moved last
      const lastMovedCreature = allCreatures[battle.lastMovedCreatureId]
      const opposedPlayerAvailableCreatures = availableCreatures.filter(
        e => e.owner !== lastMovedCreature.owner,
      )
      nextCreature = opposedPlayerAvailableCreatures[0] || availableCreatures[0]
    } else {
      // It's first move this round so we prefer attacker creatures
      const attackerAvailableCreatures = availableCreatures.filter(
        e => e.owner === 'Attacker',
      )
      nextCreature = attackerAvailableCreatures[0] || availableCreatures[0]
    }
  } else {
    // There is one creature that is faster then any other so we just pick it
    nextCreature = availableCreatures[0]
  }

  const result = {
    ...battle,
    player: {
      ...battle.player,
      current: nextCreature.owner,
    },
  }
  return {
    ...result,
    ...selectCreature(result, nextCreature.id),
  }
}
