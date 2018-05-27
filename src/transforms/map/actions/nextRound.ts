import { Battle, Player } from '../types'
import { getCount } from '../../creature'

const resetPlayer = (player: Player): Player => {
  return {
    ...player,
    availableCreatures: Object.entries(player.creatures)
      .filter(([key, creature]) => getCount(creature.health) > 0)
      .map(([key]) => key),
  }
}

export const nextRound = (battle: Battle) => {
  return {
    round: battle.round + 1,
    attacker: resetPlayer(battle.attacker),
    defender: resetPlayer(battle.defender),
  }
}
