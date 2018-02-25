import { Point } from 'transforms/map'
import { idGenerator } from 'utils'

const getId = idGenerator('creature')
export class Creature {
  id: string
  constructor(public position: Point) {
    this.id = getId()
  }
}
