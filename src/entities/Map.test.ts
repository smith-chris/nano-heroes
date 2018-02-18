import { findNeighbours, Point } from './Map'

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
        new Point(2, 2)
      ]
      expect(findNeighbours(input)).toEqual(output)
    })
  })
})
