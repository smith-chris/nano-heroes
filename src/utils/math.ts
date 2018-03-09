import { Id } from 'transforms/map'
import { Point } from 'utils/pixi'

export const pointToCoordinates = (point: Point) => {
  let { x, y } = point
  const isEven = x % 2 === 1
  const result = new Point(x * 12, y * 8)
  if (isEven) {
    result.y += 4
  }
  return result
}

const randomString = (length: number) =>
  Math.random()
    .toString(36)
    .substr(2, length)

export const idGenerator = (prefix: string = '') => {
  let count = 0
  let suffix = randomString(3)
  return (): Id => `${prefix}_${++count}_${suffix}`
}
