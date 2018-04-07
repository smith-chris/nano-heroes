import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'
import {
  Hexes,
  Obstacle,
  Battle,
  ObjectOf,
  Hex,
  Creatures,
  Id,
  Player,
  PlayerType,
} from './types'
import { higlightHexes, areNeighbours } from './path'
import { chooseRandom, chooseOther } from 'utils/battle'
import assertNever from 'utils/other'
import { getCount } from '../creature'
import { resetPlayer } from './battle'

export const putObstacles = (hexes: Hexes, obstacles: Obstacle[]) => {
  const result = { ...hexes }
  for (const obstacle of obstacles) {
    const hex = getHex(result, obstacle.position)
    if (hex && !hex.occupant) {
      hex.occupant = obstacle.type
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
  creaturesToPut: Creature[],
) => {
  const [newHexes, creatures] = putCreatures(
    attacker.creatures,
    hexes,
    creaturesToPut,
  )
  return { hexes: newHexes, attacker: { ...attacker, creatures } }
}

export const putDefenders = (
  defender: Player,
  hexes: Hexes,
  creaturesToPut: Creature[],
) => {
  const [newHexes, creatures] = putCreatures(
    defender.creatures,
    hexes,
    creaturesToPut,
  )
  return { hexes: newHexes, defender: { ...defender, creatures } }
}

export const putCreatures = (
  creatures: Creatures,
  hexes: Hexes,
  creaturesToPut: Creature[],
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

export const getPreviousCreatures = (battle: Battle) => {
  switch (battle.player.current) {
    case 'Attacker':
      return battle.defender.creatures
    case 'Defender':
      return battle.attacker.creatures
    default:
      const exhaustiveCheck: never = battle.player.current
      return {}
  }
}

export const getCurrentCreatures = (battle: Battle) => {
  switch (battle.player.current) {
    case 'Attacker':
      return battle.attacker.creatures
    case 'Defender':
      return battle.defender.creatures
    default:
      const exhaustiveCheck: never = battle.player.current
      return {}
  }
}

export const getAllCreatures = (battle: Battle): Creatures => ({
  ...battle.attacker.creatures,
  ...battle.defender.creatures,
})

export const getSelectedCreature = (battle: Battle) =>
  battle.selected.id ? getCurrentCreatures(battle)[battle.selected.id] : undefined

export const getTargetCreature = (battle: Battle) =>
  battle.target.id ? getPreviousCreatures(battle)[battle.target.id] : undefined

export const setPreviousCreature = (battle: Battle, creature: Creature) => {
  const creatures = getPreviousCreatures(battle)
  if (creatures[creature.id]) {
    const newCreatures = { ...creatures }
    newCreatures[creature.id] = creature
    return setPreviousCreatures(battle, newCreatures)
  } else {
    return battle
  }
}

export const setPreviousCreatures = (battle: Battle, creatures: Creatures) => {
  switch (battle.player.current) {
    case 'Attacker':
      return { ...battle, defender: { ...battle.defender, creatures } }
    case 'Defender':
      return { ...battle, attacker: { ...battle.attacker, creatures } }
    default:
      return assertNever(battle.player.current)
  }
}

export const setCurrentCreatures = (battle: Battle, creatures: Creatures) => {
  switch (battle.player.current) {
    case 'Attacker':
      return { ...battle, attacker: { ...battle.attacker, creatures } }
    case 'Defender':
      return { ...battle, defender: { ...battle.defender, creatures } }
    default:
      return assertNever(battle.player.current)
  }
}

export const getPlayer = (battle: Battle, playerType: PlayerType) => {
  switch (playerType) {
    case 'Attacker':
      return battle.attacker
    case 'Defender':
      return battle.defender
    default:
      return assertNever(playerType)
  }
}

export const getPreviousPlayer = (battle: Battle) => {
  switch (battle.player.current) {
    case 'Attacker':
      return battle.defender
    case 'Defender':
      return battle.attacker
    default:
      return assertNever(battle.player.current)
  }
}

export const setPlayer = (
  battle: Battle,
  playerType: PlayerType,
  player: Player,
) => {
  switch (playerType) {
    case 'Attacker':
      return { attacker: player }
    case 'Defender':
      return { defender: player }
    default:
      return assertNever(playerType)
  }
}

export const isEnemyCreature = (battle: Battle, creature: Id) => {
  switch (battle.player.current) {
    case 'Attacker':
      return Boolean(battle.defender.creatures[creature])
    case 'Defender':
      return Boolean(battle.attacker.creatures[creature])
    default:
      return assertNever(battle.player.current)
  }
}

export const isAlive = (battle: Battle, creatureId: Id) => {
  const creature = getAllCreatures(battle)[creatureId]
  return getCount(creature) > 0
}

export const canMove = (battle: Battle) => !battle.player.hasMoved

export const canAttack = (battle: Battle, id: Id) => {
  const selectedCreature = getSelectedCreature(battle)
  const targetCreature = getTargetCreature(battle)
  if (selectedCreature && targetCreature) {
    return areNeighbours(battle, targetCreature.position, selectedCreature.position)
  }
  return false
}

export const selectNextCreature = (
  battle: Battle,
  playerType: PlayerType,
  attempts = 0,
): Battle => {
  if (attempts > 1) {
    console.warn('No more creatures available. Starting new round...')
    const newBattle = {
      ...battle,
      round: battle.round + 1,
      attacker: resetPlayer(battle.attacker),
      defender: resetPlayer(battle.defender),
    }
    return selectNextCreature(newBattle, 'Attacker')
  }
  let player = getPlayer(battle, playerType)
  if (player.availableCreatures.length === 0) {
    return selectNextCreature(
      battle,
      chooseOther(playerType, 'Attacker', 'Defender'),
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
    ...setPlayer(battle, playerType, player),
    player: {
      ...battle.player,
      current: playerType,
    },
  }
  return {
    ...result,
    ...selectCreature(result, nextCreatureId),
  }
}

export const selectCreature = (battle: Battle, id: Id) => {
  const targetCreature = getCurrentCreatures(battle)[id]
  if (targetCreature) {
    const hexes = higlightHexes(battle, targetCreature.position)

    return {
      hexes,
      selected: {
        id,
      },
    }
  } else {
    console.warn('map.selectCreature() - could not find creature.')
    return {}
  }
}

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

export const each = <T, R>(
  input: ObjectOf<T> | ObjectOf<T>[],
  f: (v: T, k: string, index: number) => R,
) => {
  const results: R[] = []
  const iterate = (object: ObjectOf<T>, index: number) => {
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
    iterate(input, 0)
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

export const getHex = (hexes: Hexes, position: Point) => hexes[pointToId(position)]

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
      bottom: height - 1,
    },
    selected: {},
    attacker: new Player(),
    defender: new Player(),
    round: 0,
    player: {
      current: 'Attacker',
      hasMoved: false,
    },
    target: {},
  }
  return fillMap(map)
}
