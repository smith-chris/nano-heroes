import { Battle, Hexes } from '../types'
import { getCurrentCreatures, pointToId, setCurrentCreatures, canMove } from '../map'
import { getPath, clearPaths } from '..'
import { Point } from 'utils/pixi'

export const moveSelectedStart = (battle: Battle, position: Point) => {
  if (!canMove(battle)) {
    console.warn(`You can't move at this state:`, battle)
    return battle
  }
  const path = getPath(battle.hexes, position)
  if (path.length <= 1) {
    console.warn('Selected unaccessible hex to move to: ', position)
    return battle
  }
  return {
    ...battle,
    hexes: clearPaths(battle.hexes),
    selected: {
      ...battle.selected,
      path,
    },
  }
}

export const moveSelectedEnd = (battle: Battle) => {
  if (!canMove(battle)) {
    console.warn(`Can't move: `, battle)
    return battle
  }
  if (!(battle.selected.id && battle.selected.path)) {
    console.warn(`Required values not found on: ${JSON.stringify(battle.selected)}`)
    return battle
  }
  const creatures = getCurrentCreatures(battle)
  const selected = creatures[battle.selected.id]
  const position = battle.selected.path[battle.selected.path.length - 1]
  const currentHexId = pointToId(selected.position)
  const destinationHexId = pointToId(position)
  if (!battle.hexes[destinationHexId].occupant) {
    const hexes: Hexes = { ...battle.hexes }
    const newHex = { ...hexes[currentHexId] }
    delete newHex.occupant
    hexes[currentHexId] = newHex
    hexes[destinationHexId] = {
      ...hexes[destinationHexId],
      occupant: battle.selected.id,
    }
    const newCreatures = { ...creatures }
    newCreatures[battle.selected.id] = { ...selected, position }
    return setCurrentCreatures(
      {
        ...battle,
        hexes,
      },
      newCreatures,
    )
  } else {
    return battle
  }
}
