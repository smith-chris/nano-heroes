import { Id } from 'transforms/map'
import { Point } from 'utils/pixi'
import { idGenerator } from 'utils/math'

const getId = idGenerator('creature')
export class Creature {
  id: Id
  constructor(public position: Point) {
    this.id = getId()
  }
}
