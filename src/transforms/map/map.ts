import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'
import { Hexes, Obstacle, Map, HashMap, Hex, Creatures, Id } from './types'
import { higlightHexes } from './path'

export const putObstacles = (hexes: Hexes, obstacles: Obstacle[]) => {
  const result = { ...hexes }
  for (const obstacle of obstacles) {
    const hex = getHex(result, obstacle.position)
    if (hex && !hex.occupant) {
      hex.occupant = obstacle
    } else {
      throw new Error('No hex at id: ' + pointToId(obstacle.position))
    }
  }
  return result
}

export const putAttackers = (
  attackers: Creatures,
  hexes: Hexes,
  creaturesToPut: Creature[]
) => {
  const [newHexes, newAttackers] = putCreatures(
    attackers,
    hexes,
    creaturesToPut
  )
  return { hexes: newHexes, attackers: newAttackers }
}

export const putDefenders = (
  defenders: Creatures,
  hexes: Hexes,
  creaturesToPut: Creature[]
) => {
  const [newHexes, newDefenders] = putCreatures(
    defenders,
    hexes,
    creaturesToPut
  )
  return { hexes: newHexes, defenders: newDefenders }
}

export const putCreatures = (
  creatures: Creatures,
  hexes: Hexes,
  creaturesToPut: Creature[]
): [Hexes, Creatures] => {
  const newHexes = { ...hexes }
  const newCreatures = { ...creatures }
  for (const creature of creaturesToPut) {
    const { id } = creature
    const hexId = pointToId(creature.position)
    const hex = hexes[hexId]
    if (hex && !hex.occupant) {
      hexes[hexId] = { ...hex, occupant: id }
      newCreatures[id] = creature
    } else {
      throw new Error('No hex at id: ' + pointToId(creature.position))
    }
  }
  return [newHexes, newCreatures]
}

export const getCreatures = (map: Map) => {
  switch (map.turnOf) {
    case 'Attacker':
      return map.attackers
    case 'Defender':
      return map.defenders
    default:
      const exhaustiveCheck: never = map.turnOf
      return {}
  }
}

export const setCreatures = (map: Map, creatures: Creatures) => {
  switch (map.turnOf) {
    case 'Attacker':
      return { ...map, attackers: creatures }
    case 'Defender':
      return { ...map, defenders: creatures }
    default:
      const exhaustiveCheck: never = map.turnOf
      return map
  }
}

export const selectCreature = (map: Map, id: Id) => {
  const targetCreature = getCreatures(map)[id]
  if (targetCreature) {
    const hexes = higlightHexes(map, targetCreature.position)
    return {
      hexes,
      selected: {
        id
      }
    }
  } else {
    return {}
  }
}

export const moveSelected = (map: Map) => {
  if (!(map.selected.path && map.selected.id)) {
    return map
  }
  const creatures = getCreatures(map)
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
      occupant: map.selected.id
    }
    const newCreatures = { ...creatures }
    newCreatures[map.selected.id] = { ...selected, position }
    return setCreatures({ ...map, hexes, selected: {} }, newCreatures)
  } else {
    return map
  }
}

export const each = <T, R>(
  input: HashMap<T> | HashMap<T>[],
  f: (v: T, k: string) => R
) => {
  const results: R[] = []
  const iterate = (object: HashMap<T>) => {
    for (let key in object) {
      const val = object[key]
      results.push(f(val, key))
    }
  }
  if (Array.isArray(input)) {
    for (let object of input) {
      iterate(object)
    }
  } else {
    iterate(input)
  }
  return results
}

export const xyToId = (x: number, y: number) => {
  return `${x}_${y}`
}

export const pointToId = (position: Point) => {
  return xyToId(position.x, position.y)
}

export const idToPoint = (id: string) => {
  let [x, y] = id.split('_')
  return new Point(parseInt(x, 10), parseInt(y, 10))
}

export const getHex = (hexes: Hexes, position: Point) =>
  hexes[pointToId(position)]

const fillMap = (map: Map) => {
  const { top, right, bottom, left } = map.bounds
  const hexes: Hexes = {}
  for (let x = left; x <= right; x++) {
    for (let y = top; y <= bottom; y++) {
      hexes[xyToId(x, y)] = new Hex(new Point(x, y))
    }
  }
  return { ...map, hexes }
}

export const createMap = (width: number, height: number) => {
  const map: Map = {
    hexes: {},
    bounds: {
      left: 0,
      top: 0,
      right: width - 1,
      bottom: height - 1
    },
    selected: {},
    attackers: {},
    turnOf: 'Attacker',
    defenders: {}
  }
  return fillMap(map)
}
