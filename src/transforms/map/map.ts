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

export const addObstacles = (hexes: Hexes, obstacles: Obstacle[]) => {
  const result = { ...hexes }
  for (const obstacle of obstacles) {
    const hex = getHex(result, obstacle.position)
    if (hex && !hex.occupant) {
      hex.occupant = obstacle.type
    } else {
      if (hex.occupant) {
        console.warn('Hex already occupied', hex)
      } else {
        console.warn(
          `Could not add obstacle to hex at ${pointToId(obstacle.position)}: `,
          hex,
        )
      }
    }
  }
  return result
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

export const availableCreaturesCount = (battle: Battle) =>
  battle.defender.availableCreatures.length +
  battle.attacker.availableCreatures.length

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
