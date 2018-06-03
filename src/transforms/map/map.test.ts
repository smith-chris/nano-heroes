import {
  findNeighbours,
  createBattle,
  possiblePaths,
  simplifyNodes,
  xyToId,
  addObstacles,
  Obstacle,
} from './index'
import { Point } from 'utils/pixi'

describe('Map', () => {
  describe('findNeighbours()', () => {
    it('should only neighbouring points 1', () => {
      const input = new Point(0, 0)
      const output = [new Point(0, 1), new Point(1, 0)]
      expect(findNeighbours(input)).toEqual(output)
    })
    it('should only neighbouring points 2', () => {
      const input = new Point(1, 1)
      const output = [
        new Point(0, 1),
        new Point(0, 2),
        new Point(1, 0),
        new Point(1, 2),
        new Point(2, 1),
        new Point(2, 2),
      ]
      expect(findNeighbours(input)).toEqual(output)
    })
    it('should only neighbouring points 3', () => {
      const input = new Point(2, 2)
      const output = [
        new Point(1, 1),
        new Point(1, 2),
        new Point(2, 1),
        new Point(2, 3),
        new Point(3, 1),
        new Point(3, 2),
      ]
      expect(findNeighbours(input)).toEqual(output)
    })
  })
  describe('possiblePaths()', () => {
    it('should find possible paths', () => {
      const map = createBattle(10, 10)
      const start = new Point(0, 0)
      const distance = 1
      const output = {
        [xyToId(1, 0)]: 1,
        [xyToId(0, 1)]: 1,
      }
      expect(simplifyNodes(possiblePaths(map, start, distance))).toEqual(output)
    })

    it('should find possible paths', () => {
      const map = createBattle(10, 10)
      const start = new Point(1, 1)
      const distance = 2
      const output = {
        [xyToId(0, 0)]: 2,
        [xyToId(0, 1)]: 1,
        [xyToId(0, 2)]: 1,
        [xyToId(0, 3)]: 2,
        [xyToId(1, 0)]: 1,
        [xyToId(1, 2)]: 1,
        [xyToId(1, 3)]: 2,
        [xyToId(2, 0)]: 2,
        [xyToId(2, 1)]: 1,
        [xyToId(2, 2)]: 1,
        [xyToId(2, 3)]: 2,
        [xyToId(3, 0)]: 2,
        [xyToId(3, 1)]: 2,
        [xyToId(3, 2)]: 2,
      }
      expect(simplifyNodes(possiblePaths(map, start, distance))).toEqual(output)
    })

    it('should find possible paths avoiding obstacles', () => {
      const map = createBattle(10, 10)
      map.hexes = addObstacles(map.hexes, [
        new Obstacle(new Point(2, 1)),
        new Obstacle(new Point(2, 2)),
      ])
      const start = new Point(1, 1)
      const distance = 2
      const output = {
        [xyToId(0, 0)]: 2,
        [xyToId(0, 1)]: 1,
        [xyToId(0, 2)]: 1,
        [xyToId(0, 3)]: 2,
        [xyToId(1, 0)]: 1,
        [xyToId(1, 2)]: 1,
        [xyToId(1, 3)]: 2,
        [xyToId(2, 0)]: 2,
        [xyToId(2, 3)]: 2,
      }
      expect(simplifyNodes(possiblePaths(map, start, distance))).toEqual(output)
    })
  })
})
