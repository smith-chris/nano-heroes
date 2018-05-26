import { Battle, Hexes } from '../types'
import { getCurrentCreatures, pointToId, setCurrentCreatures } from '../map'

export const moveSelected = (map: Battle) => {
  if (!(map.selected.id && map.selected.path)) {
    console.warn(`Required values not found on: ${JSON.stringify(map.selected)}`)
    return map
  }
  const creatures = getCurrentCreatures(map)
  const selected = creatures[map.selected.id]
  const position = map.selected.path[map.selected.path.length - 1]
  const currentHexId = pointToId(selected.position)
  const destinationHexId = pointToId(position)
  if (!map.hexes[destinationHexId].occupant) {
    const hexes: Hexes = { ...map.hexes }
    const newHex = { ...hexes[currentHexId] }
    delete newHex.occupant
    hexes[currentHexId] = newHex
    hexes[destinationHexId] = {
      ...hexes[destinationHexId],
      occupant: map.selected.id,
    }
    const newCreatures = { ...creatures }
    newCreatures[map.selected.id] = { ...selected, position }
    return setCurrentCreatures(
      {
        ...map,
        hexes,
      },
      newCreatures,
    )
  } else {
    return map
  }
}
