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

export const getSelectedCreature = (battle: Battle) =>
  battle.selected.id ? battle.creatures[battle.selected.id] : undefined

export const getTargetCreature = (battle: Battle) =>
  battle.target.id ? battle.creatures[battle.target.id] : undefined

export const isEnemyCreature = (battle: Battle, creatureId: Id) =>
  battle.creatures[creatureId] &&
  battle.creatures[creatureId].owner !== battle.player.current

export const isAlive = (battle: Battle, creatureId: Id) => {
  const creature = battle.creatures[creatureId]
  return getCount(creature.health) > 0
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

export const canCreatureMove = (creature: Creature) =>
  !creature.hasMoved && getCount(creature.health) > 0

export const availableCreaturesCount = (battle: Battle) =>
  Object.values(battle.creatures).filter(canCreatureMove).length

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

export const createBattle = (width: number, height: number) => {
  const map: Battle = {
    hexes: {},
    bounds: {
      left: 0,
      top: 0,
      right: width - 1,
      bottom: height - 1,
    },
    selected: {},
    creatures: {},
    round: 0,
    player: {
      current: 'Attacker',
      hasMoved: false,
    },
    target: {},
  }
  return fillMap(map)
}
