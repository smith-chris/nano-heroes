import { Player } from './types'
import { getCount } from 'transforms/creature'

export const resetPlayer = (player: Player): Player => {
  return {
    ...player,
    availableCreatures: Object.entries(player.creatures)
      .filter(([key, creature]) => getCount(creature) > 0)
      .map(([key]) => key),
  }
}
