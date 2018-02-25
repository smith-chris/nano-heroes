import { Point, Id } from 'transforms/map'
import { idGenerator } from 'utils'

const getId = idGenerator('creature')
export class Creature {
  id: Id
  constructor(public position: Point) {
    this.id = getId()
  }
}
