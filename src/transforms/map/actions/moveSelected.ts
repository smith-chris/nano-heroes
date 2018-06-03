import { Battle, Hexes } from '../types'
import { pointToId, canMove, getSelectedCreature } from '../map'
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
  const {
    selected: { path },
    hexes,
    creatures,
  } = battle

  if (!canMove(battle)) {
    console.warn(`Can't move: `, battle)
    return battle
  }
  const selectedCreature = getSelectedCreature(battle)
  if (!selectedCreature || !(battle.selected.id && path)) {
    console.warn(`Required values not found on: ${JSON.stringify(battle.selected)}`)
    return battle
  }
  const destinationPosition = path[path.length - 1]
  const currentHexId = pointToId(selectedCreature.position)
  const destinationHexId = pointToId(destinationPosition)
  if (!hexes[destinationHexId].occupant) {
    const newHexes: Hexes = { ...hexes }
    const newHex = { ...newHexes[currentHexId] }
    delete newHex.occupant
    newHexes[currentHexId] = newHex
    newHexes[destinationHexId] = {
      ...newHexes[destinationHexId],
      occupant: battle.selected.id,
    }
    const newCreatures = { ...creatures }
    newCreatures[battle.selected.id] = {
      ...selectedCreature,
      position: destinationPosition,
      hasMoved: true,
    }
    return {
      ...battle,
      hexes: newHexes,
      creatures: newCreatures,
      lastMovedCreatureId: battle.selected.id,
    }
  } else {
    return battle
  }
}
