import { Battle, Hexes } from '../types'
import { pointToId, getSelectedCreature } from '../map'
import { getPath, deletePaths } from '..'
import { Point } from 'utils/pixi'

export const moveSelectedStart = (battle: Battle, position: Point) => {
  const path = getPath(battle.hexes, position)
  if (path.length <= 1) {
    console.warn('Selected unaccessible hex to move to: ', position)
    return {}
  }
  return {
    hexes: deletePaths(battle.hexes),
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
      hexes: newHexes,
      creatures: newCreatures,
      lastMovedCreatureId: battle.selected.id,
    }
  } else {
    return {}
  }
}
