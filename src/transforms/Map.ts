import { Creature } from './Creature'

export class Point {
  constructor(public x: number, public y: number) {}
}

export class Hex {
  occupant: string | Creature
  position: Point
  path: Hex[]
  distance: number
  constructor(public type: string = 'grass') {}
}

export type Hexes = {
  [key: string]: Hex
}

export class Obstacle {
  constructor(public position: Point, public type: string = 'grass') {}
}

export const putObstacles = (hexes: Hexes, obstacles: Obstacle[]) => {
  const result = { ...hexes }
  for (const obstacle of obstacles) {
    const hex = getHex(result, obstacle.position)
    if (hex && !hex.occupant) {
      hex.occupant = obstacle
    } else {
      throw new Error('No hex at id: ' + pointToId(obstacle.position))
    }
  }
  return result
}

export const putCreatures = (hexes: Hexes, creatures: Creature[]) => {
  const result = { ...hexes }
  for (const creature of creatures) {
    const hex = getHex(result, creature.position)
    if (hex && !hex.occupant) {
      hex.occupant = creature
    } else {
      throw new Error('No hex at id: ' + pointToId(creature.position))
    }
  }
  return result
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

export const xyToId = (x: number, y: number) => {
  return `${x}_${y}`
}

export const pointToId = (position: Point) => {
  return xyToId(position.x, position.y)
}

export const idToPoint = (id: string) => {
  let [x, y] = id.split('_')
  return new Point(parseInt(x, 10), parseInt(y, 10))
}

export type Map = {
  hexes: Hexes
  bounds: Bounds
}

export const getHex = (hexes: Hexes, position: Point) =>
  hexes[pointToId(position)]

const fillMap = (map: Map) => {
  const { top, right, bottom, left } = map.bounds
  const hexes: Hexes = {}
  for (let x = left; x <= right; x++) {
    for (let y = top; y <= bottom; y++) {
      hexes[xyToId(x, y)] = new Hex()
    }
  }
  return { ...map, hexes }
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
  return fillMap(map)
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

export class PosHex {
  constructor(public hex: Hex, public position: Point) {}
}

type Node = {
  last: PosHex
  path: PosHex[]
  distance: number
}

export type Nodes = {
  [key: string]: Node
}

type Graph = {
  map: Map
  nodes: Nodes
}

const subtract = (a: Point, b: Point) => {
  return new Point(a.x - b.x, a.y - b.y)
}

const diff = (a: Point, b: Point) => Math.abs(a.x - b.x + a.y - b.y)

export const possiblePaths = (map: Map, start: Point, limit: number = 4) => {
  const resultGraph: Graph = {
    map,
    nodes: {}
  }
  const startId = pointToId(start)
  const startNode: Node = {
    last: new PosHex(getHex(map.hexes, start), start),
    distance: 0,
    path: []
  }
  resultGraph.nodes[startId] = startNode
  const buildGraph = (graph: Graph, node: Node) => {
    const { bounds, hexes } = graph.map
    const { distance, last, path } = node
    const neighbours = findNeighbours(last.position, bounds)
    const currentDistance = distance + 1
    if (currentDistance > limit) {
      return
    }
    for (const position of neighbours) {
      const id = pointToId(position)
      const existingNode = graph.nodes[id]
      if (existingNode && existingNode.distance <= currentDistance) {
        continue
      }
      const hex = getHex(hexes, position)
      if (hex.occupant) {
        continue
      }
      const newNode = {
        last: new PosHex(hex, position),
        distance: currentDistance,
        path: [...path, last]
      }
      graph.nodes[id] = newNode
      buildGraph(graph, newNode)
    }
  }
  buildGraph(resultGraph, startNode)
  delete resultGraph.nodes[startId]
  return resultGraph.nodes
}

type SimplePaths = {
  [key: string]: number
}
// Purely for testing
export const simplifyNodes = (nodes: Nodes) => {
  const result: SimplePaths = {}
  for (const key in nodes) {
    const node = nodes[key]
    result[key] = node.distance
  }
  return result
}

export const higlightHexes = (map: Map, start: Point) => {
  const nodes = possiblePaths(map, start)
  const hexes: Hexes = {}
  for (const key in map.hexes) {
    const hex = map.hexes[key]
    const node = nodes[key]
    if (node) {
      hexes[key] = { ...hex, path: node.path }
    } else {
      hexes[key] = { ...hex, path: null }
    }
  }
  return { ...map, hexes }
}
