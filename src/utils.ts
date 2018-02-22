import Map, { idToPoint, findPath, pointToId, Hexes, Point } from 'entities/Map'

export const pointToCoordinates = (point: Point) => {
  let { x, y } = point
  const isEven = x % 2 === 1
  const result = new Point(x * 12, y * 8)
  if (isEven) {
    result.y += 4
  }
  return result
}
