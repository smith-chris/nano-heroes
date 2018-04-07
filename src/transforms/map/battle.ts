import { Player } from './types'
import { Creature, getCount } from '../creature'

export const resetPlayer = (player: Player): Player => {
  return {
    ...player,
    availableCreatures: Object.entries(player.creatures)
      .filter(([key, creature]) => getCount(creature) > 0)
      .map(([key]) => key),
  }
}
