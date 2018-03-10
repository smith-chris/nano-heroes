import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'
import { Hexes, Obstacle, Map, HashMap, Hex } from './types'

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

export const putCreatures = (map: Map, newCreatures: Creature[]) => {
  const hexes = { ...map.hexes }
  const creatures = { ...map.creatures }
  for (const creature of newCreatures) {
    const { id } = creature
    const hexId = pointToId(creature.position)
    const hex = hexes[hexId]
    if (hex && !hex.occupant) {
      hexes[hexId] = { ...hex, occupant: id }
      creatures[id] = creature
    } else {
      throw new Error('No hex at id: ' + pointToId(creature.position))
    }
  }
  return { ...map, hexes, creatures }
}

export const moveSelected = (map: Map) => {
  if (!(map.selected.path && map.selected.id)) {
    return map
  }
  const selected = map.creatures[map.selected.id]
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
    const creatures = { ...map.creatures }
    creatures[map.selected.id] = { ...selected, position }
    return { ...map, hexes, creatures, selected: {} }
  } else {
    return map
  }
}

export const each = <T, R>(object: HashMap<T>, f: (v: T, k: string) => R) => {
  const results = []
  for (let key in object) {
    const val = object[key]
    results.push(f(val, key))
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
    creatures: {}
  }
  return fillMap(map)
}
