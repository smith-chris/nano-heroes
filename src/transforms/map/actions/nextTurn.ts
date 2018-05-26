import { Battle } from '../types'
import { chooseOther } from 'utils/battle'

export const nextTurn = (battle: Battle) => {
  return {
    selected: {},
    player: {
      ...battle.player,
      current: chooseOther(battle.player.current, 'Attacker', 'Defender'),
    },
  }
}
