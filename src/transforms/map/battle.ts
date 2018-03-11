import { Battle, Player } from './types'

export const resetPlayer = (player: Player): Player => {
  return {
    ...player,
    availableCreatures: Object.keys(player.creatures)
  }
}
