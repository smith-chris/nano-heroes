export class Hex {
  neighbours: Hex[] = []
  id: string
  position: Point
  type: 'grass' | 'stone'
  occupied: boolean
  constructor() {
    this.type = Math.random() > 0.96 ? 'stone' : 'grass'
    if (this.type === 'stone') {
      this.occupied = true
    }
  }
}

export type Hexes = {
  [key: string]: Hex
}

export class Point {
  constructor(public x: number, public y: number) {}
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

export const pointToId = (position: Point) => {
  return `${position.x}_${position.y}`
}

export const idToPoint = (id: string) => {
  let [x, y] = id.split('_')
  return new Point(parseInt(x, 10), parseInt(y, 10))
}

export type Map = {
  hexes: Hexes
  bounds: Bounds
}

export const getHex = (map: Map, position: Point) => {
  const { hexes, bounds } = map
  const id = pointToId(position)
  let hex = hexes[id]
  if (!hex) {
    hexes[id] = hex = new Hex()
    hex.id = id
    hex.position = position
    hex.neighbours = findNeighbours(position, bounds).map(e => getHex(map, e))
  }
  return hex
}

export const createMap = (width: number, height: number): Map => {
  const map = {
    hexes: {},
    bounds: {
      left: 0,
      top: 0,
      right: width - 1,
      bottom: height - 1
    }
  }
  getHex(map, new Point(0, 0))
  return map
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

const subtract = (a: Point, b: Point) => {
  return new Point(a.x - b.x, a.y - b.y)
}

const diff = (a: Point, b: Point) => Math.abs(a.x - b.x + a.y - b.y)

const sortInDirection = (hex: Hex, point: Point) => {
  const dir = subtract(point, hex.position)
  return hex.neighbours.sort((a, b) => {
    let aDir = subtract(point, a.position)
    let bDir = subtract(point, b.position)
    let aDiff = diff(dir, aDir)
    let bDiff = diff(dir, bDir)
    return aDiff < bDiff ? 1 : -1
  })
}

type findPath = (
  a: {
    map: Map
    start: Point
    end: Point
  }
) => Hex[]
export const findPath: findPath = ({ map, start, end }) => {
  let startHex = getHex(map, start)
  let endId = pointToId(end)
  let resultGraph: Graph = {}
  let startNode: Node = {
    current: startHex,
    distance: 0,
    path: []
  }
  resultGraph[startHex.id] = startNode
  let fastest = map.bounds.right * map.bounds.bottom
  let buildGraph = (graph: Graph, node: Node) => {
    const { distance, current, path } = node
    let neighbours = sortInDirection(current, end)
    for (let neighbour of neighbours) {
      const { id, occupied } = neighbour
      const existingNode = graph[id]
      if (occupied || distance > fastest) {
        continue
      }
      if (existingNode && existingNode.distance < distance + 1) {
        continue
      }
      const newNode = {
        current: neighbour,
        distance: distance + 1,
        path: [...path, current]
      }
      graph[id] = newNode
      if (id === endId) {
        fastest = newNode.distance
      }
      buildGraph(graph, newNode)
    }
  }
  buildGraph(resultGraph, startNode)
  let endNode = resultGraph[endId]
  return [...endNode.path, endNode.current]
}
