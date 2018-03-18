import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'
import {
  Hexes,
  Obstacle,
  Battle,
  HashMap,
  Hex,
  Creatures,
  Id,
  Player
} from './types'
import { higlightHexes } from './path'
import { chooseRandom } from 'utils/battle'

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

const removeElement = <T>(data: T[], element: T) => {
  const index = data.indexOf(element)
  if (index > -1) {
    const result = [...data]
    result.splice(index, 1)
    return result
  }
  return data
}

export const putAttackers = (
  attacker: Player,
  hexes: Hexes,
  creaturesToPut: Creature[]
) => {
  const [newHexes, creatures] = putCreatures(
    attacker.creatures,
    hexes,
    creaturesToPut
  )
  return { hexes: newHexes, attacker: { ...attacker, creatures } }
}

export const putDefenders = (
  defender: Player,
  hexes: Hexes,
  creaturesToPut: Creature[]
) => {
  const [newHexes, creatures] = putCreatures(
    defender.creatures,
    hexes,
    creaturesToPut
  )
  return { hexes: newHexes, defender: { ...defender, creatures } }
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

export const getCreatures = (map: Battle) => {
  switch (map.player.current) {
    case 'Attacker':
      return map.attacker.creatures
    case 'Defender':
      return map.defender.creatures
    default:
      const exhaustiveCheck: never = map.player.current
      return {}
  }
}

export const setCreatures = (battle: Battle, creatures: Creatures) => {
  switch (battle.player.current) {
    case 'Attacker':
      return { ...battle, attacker: { ...battle.attacker, creatures } }
    case 'Defender':
      return { ...battle, defender: { ...battle.defender, creatures } }
    default:
      const exhaustiveCheck: never = battle.player.current
      return battle
  }
}

export const getCurrentPlayer = (battle: Battle) => {
  switch (battle.player.current) {
    case 'Attacker':
      return battle.attacker
    case 'Defender':
      return battle.defender
    default:
      const exhaustiveCheck: never = battle.player.current
      return null
  }
}

export const setCurrentPlayer = (battle: Battle, player: Player) => {
  switch (battle.player.current) {
    case 'Attacker':
      return { attacker: player }
    case 'Defender':
      return { defender: player }
    default:
      const exhaustiveCheck: never = battle.player.current
      return battle
  }
}

export const canMove = (battle: Battle) => !battle.player.hasMoved

export const selectNextCreature = (battle: Battle) => {
  const player = { ...getCurrentPlayer(battle) }
  const nextCreatureId = chooseRandom(...player.availableCreatures)
  player.availableCreatures = removeElement(
    player.availableCreatures,
    nextCreatureId
  )
  return {
    ...setCurrentPlayer(battle, player),
    ...selectCreature(battle, nextCreatureId)
  }
}

export const selectCreature = (battle: Battle, id: Id) => {
  const targetCreature = getCreatures(battle)[id]
  if (targetCreature) {
    const hexes = higlightHexes(battle, targetCreature.position)
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

export const moveSelected = (map: Battle) => {
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
    return setCreatures(
      {
        ...map,
        hexes,
        selected: {}
      },
      newCreatures
    )
  } else {
    return map
  }
}

export const each = <T, R>(
  input: HashMap<T> | HashMap<T>[],
  f: (v: T, k: string, index: number) => R
) => {
  const results: R[] = []
  const iterate = (object: HashMap<T>, index?: number) => {
    for (let key in object) {
      const val = object[key]
      results.push(f(val, key, index))
    }
  }
  if (Array.isArray(input)) {
    input.forEach((object, index) => {
      iterate(object, index)
    })
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

const fillMap = (map: Battle) => {
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
  const map: Battle = {
    hexes: {},
    bounds: {
      left: 0,
      top: 0,
      right: width - 1,
      bottom: height - 1
    },
    selected: {},
    attacker: new Player(),
    defender: new Player(),
    player: {
      current: 'Attacker',
      hasMoved: false
    }
  }
  return fillMap(map)
}
