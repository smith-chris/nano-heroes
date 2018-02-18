export type HexMap = {
  [key: string]: Hex
}

export class Point {
  constructor(public x: number, public y: number) {}
}
const coordinatesToId = (x: number, y: number) => {
  return `${x}_${y}`
}

const idToCoordinates = (id: string) => {
  let [x, y] = id.split('_')
  return [parseInt(x, 10), parseInt(y, 10)]
}

const allocateHexes = (width: number, height: number) => {
  const hexes: HexMap = {}
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      hexes[coordinatesToId(x, y)] = new Hex()
    }
  }
  return hexes
}

export const findNeighbours = (center: Point) => {
  let results: Point[] = []
  for (let x = center.x - 1; x <= center.x + 1; x++) {
    for (let y = center.y - 1; y <= center.y + 1; y++) {
      const isCenter = x === center.x && y === center.y
      if (!isCenter && x >= 0 && y >= 0) {
        results.push(new Point(x, y))
      }
    }
  }
  return results
}

export default class Map {
  private hexes: HexMap
  constructor(width: number, height: number) {
    this.hexes = allocateHexes(width, height)
  }

  get(x: number, y: number) {
    return this.hexes[coordinatesToId(x, y)]
  }
}

class Hex {
  neighbours: Hex[]
}

type findPath = (
  a: {
    map: Map
    start: Point
    end: Point
  }
) => Hex[]
export const findPath: findPath = ({ map, start, end }) => {
  let result: Hex[] = []
  return result
}
