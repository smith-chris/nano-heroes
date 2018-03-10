import { Hexes, Obstacle, Map, HashMap, Hex, Bounds } from './types'
import { getHex, pointToId } from './map'
import { Point } from 'utils/pixi'

export const clearPaths = (hexes: Hexes) => {
  const result: Hexes = {}
  for (const key in hexes) {
    result[key] = { ...hexes[key], path: [] }
  }
  return result
}

export const getPath = (hexes: Hexes, position: Point) => {
  const hex = hexes[pointToId(position)]
  return [...hex.path, hex.position]
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
  last: Hex
  path: Hex[]
  distance: number
}

export type Nodes = {
  [key: string]: Node
}

type Graph = {
  map: Map
  nodes: Nodes
}

export const possiblePaths = (map: Map, start: Point, limit: number = 3) => {
  const resultGraph: Graph = {
    map,
    nodes: {}
  }
  const startId = pointToId(start)
  const startNode: Node = {
    last: getHex(map.hexes, start),
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
        last: hex,
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
      const path = node.path.map(n => n.position)
      hexes[key] = { ...hex, path }
    } else {
      hexes[key] = { ...hex, path: [] }
    }
  }
  return hexes
}