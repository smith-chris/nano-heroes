import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'

export type Id = string

export class Hex {
  occupant: string
  canBeAttacked: boolean = false
  path: Point[]
  distance: number
  constructor(public position: Point, public type: string = 'grass') {
    this.path = []
  }
}

export type HashMap<T> = {
  [key: string]: T
}

export type Creatures = HashMap<Creature>

export type Hexes = HashMap<Hex>

export class Obstacle {
  constructor(public position: Point, public type: string = 'grass') {}
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

export class Player {
  creatures: Creatures = {}
  availableCreatures: Id[] = []
}

export type PlayerType = 'Attacker' | 'Defender'

export type Battle = {
  hexes: Hexes
  bounds: Bounds
  attacker: Player
  defender: Player
  player: {
    current: PlayerType
    hasMoved: Boolean
  }
  selected: {
    id?: Id
    path?: Point[]
  }
}
