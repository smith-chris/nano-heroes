import { Map, Point, Hex } from 'transforms/Map'
export class Creature {
  constructor(public hex: Hex) {}
}

export class Creatures {
  left: Creature[]
  right: Creature[]
  constructor(map: Map) {
    this.left = [2, 5, 8, 11, 14].map(
      y => new Creature(map.get(new Point(0, y)))
    )
    this.right = [2, 5, 8, 11, 14].map(
      y => new Creature(map.get(new Point(map.width - 1, y)))
    )
  }
}
