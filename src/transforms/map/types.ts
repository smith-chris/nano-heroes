import { Creature, StackHealth } from 'transforms/creature'
import { Point } from 'utils/pixi'

export type Id = string

export class Hex {
  occupant?: string
  canBeAttacked?: boolean
  path?: Point[]
  constructor(public position: Point, public type: string = 'grass') {}
}

export type ObjectOf<T> = {
  [key: string]: T
}

export type Creatures = ObjectOf<Creature>

export type Hexes = ObjectOf<Hex>

export class Obstacle {
  constructor(public position: Point, public type: string = 'stone') {}
}

export class Bounds {
  left: number
  top: number
  right: number
  bottom: number
  constructor(bounds: Bounds = { left: 0, top: 0, right: 9999, bottom: 9999 }) {
    this.left = bounds.left
    this.top = bounds.top
    this.right = bounds.right
    this.bottom = bounds.bottom
  }
}

export type Rect = {
  x?: number
  y?: number
  width: number
  height: number
}

export class Player {
  creatures: Creatures = {}
}

export type PlayerType = 'Attacker' | 'Defender'

export type Battle = {
  hexes: Hexes
  bounds: Bounds
  attacker: Player
  defender: Player
  round: number
  player: {
    current: PlayerType
    hasMoved: Boolean
  }
  lastMovedCreatureId?: Id
  selected: {
    id?: Id
    path?: Point[]
  }
  target: {
    id?: Id
    incomingHealth?: StackHealth
  }
}
