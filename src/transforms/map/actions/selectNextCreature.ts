import { chooseOther, chooseRandom } from 'utils/battle'
import { getPlayer, setPlayer, selectCreature } from '../map'
import { PlayerType, Battle } from '../types'

const removeElement = <T>(data: T[], element: T) => {
  const index = data.indexOf(element)
  if (index > -1) {
    const result = [...data]
    result.splice(index, 1)
    return result
  }
  return data
}

export const selectNextCreature = (
  battle: Battle,
  playerType?: PlayerType,
  attempts = 0,
): Battle => {
  if (attempts > 5) {
    throw new Error('Infinite recursion in "selectNextCreature".')
  }
  let _playerType =
    playerType || chooseOther(battle.player.current, 'Attacker', 'Defender')
  let player = getPlayer(battle, _playerType)
  if (player.availableCreatures.length === 0) {
    return selectNextCreature(
      battle,
      chooseOther(_playerType, 'Attacker', 'Defender'),
      attempts + 1,
    )
  }

  player = { ...player }
  const nextCreatureId = chooseRandom(...player.availableCreatures)

  player.availableCreatures = removeElement(
    player.availableCreatures,
    nextCreatureId,
  )
  const result = {
    ...battle,
    ...setPlayer(battle, _playerType, player),
    player: {
      ...battle.player,
      current: _playerType,
    },
  }
  return {
    ...result,
    ...selectCreature(result, nextCreatureId),
  }
}
