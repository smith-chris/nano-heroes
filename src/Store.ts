import { Map } from 'transforms/Map'
import { Creatures } from 'transforms/Creatures'

export class Store {
  map: Map
  creatures: Creatures
  constructor() {
    this.map = new Map(10, 15)
    this.creatures = new Creatures(this.map)
  }
}
