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

export const selectNextCreature = (battle: Battle, playerType?: PlayerType): Battle => {
  const allCreatures = getAllCreatures(battle)

  const nextCreature = chooseRandom(
    ...Object.values(allCreatures).filter(canCreatureMove),
  )

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
