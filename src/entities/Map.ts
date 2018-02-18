class Hex {
  neighbours: Hex[] = []
  id: string
}

export type Hexes = {
  [key: string]: Hex
}

export class Point {
  constructor(public x: number, public y: number) {}
}

class Bounds {
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

const pointToId = (position: Point) => {
  return `${position.x}_${position.y}`
}

const idToPoint = (id: string) => {
  let [x, y] = id.split('_')
  return new Point(parseInt(x, 10), parseInt(y, 10))
}

class Map {
  private hexes: Hexes
  private bounds: Bounds
  constructor(public width: number, public height: number) {
    this.hexes = {}
    this.bounds = {
      left: 0,
      top: 0,
      right: width,
      bottom: height
    }
  }

  get = (position: Point) => {
    const id = pointToId(position)
    let hex = this.hexes[id]
    if (!hex) {
      this.hexes[id] = hex = new Hex()
      hex.id = id
      hex.neighbours = findNeighbours(position, this.bounds).map(this.get)
    }
    return hex
  }
}

export const findNeighbours = (center: Point, bounds = new Bounds()) => {
  let results: Point[] = []
  let isCenterXEven = center.x % 2 === 0
  for (let x = center.x - 1; x <= center.x + 1; x++) {
    for (let y = center.y - 1; y <= center.y + 1; y++) {
      const isCenter = x === center.x && y === center.y
      const isInBounds =
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      if (isInBounds) {
        const isLeftOrRight = x !== center.x
        if (isLeftOrRight) {
          // Depending on wheter the center hex is in even column
          // there are some limitations to left and right hexes
          // (only 2 of three on each side are correct)
          if (isCenterXEven) {
            if (y <= center.y) {
              results.push(new Point(x, y))
            }
          } else {
            if (y >= center.y) {
              results.push(new Point(x, y))
            }
          }
        } else if (!isCenter) {
          results.push(new Point(x, y))
        }
      }
    }
  }
  return results
}

type Node = {
  current: Hex
  path: Hex[]
  distance: number
}

type Graph = {
  [key: string]: Node
}

type findPath = (
  a: {
    map: Map
    start: Point
    end: Point
  }
) => Hex[]
export const findPath: findPath = ({ map, start, end }) => {
  let startHex = map.get(start)
  let endId = pointToId(end)
  let resultGraph: Graph = {}
  let startNode: Node = {
    current: startHex,
    distance: 0,
    path: []
  }
  resultGraph[startHex.id] = startNode
  let buildGraph = (graph: Graph, node: Node) => {
    const { distance, current, path } = node
    for (let neighbour of current.neighbours) {
      const { id } = neighbour
      const neighbourNode = graph[id]
      if (neighbourNode && neighbourNode.distance < distance + 1) {
        continue
      }
      const newNode = {
        current: neighbour,
        distance: distance + 1,
        path: [...path, current]
      }
      graph[id] = newNode
      if (!neighbourNode) {
        buildGraph(graph, newNode)
      }
    }
  }
  buildGraph(resultGraph, startNode)
  return resultGraph[endId].path
}
