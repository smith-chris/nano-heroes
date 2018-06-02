import mapValues from 'lodash.mapvalues'
import { Battle, Player } from '../types'
import { getCount } from '../../creature'

const resetPlayer = (player: Player): Player => {
  return {
    ...player,
    creatures: mapValues(player.creatures, creature => {
      const result = { ...creature }
      delete result.hasMoved
      return result
    }),
  }
}

export const nextRound = (battle: Battle) => {
  return {
    round: battle.round + 1,
    attacker: resetPlayer(battle.attacker),
    defender: resetPlayer(battle.defender),
  }
}
