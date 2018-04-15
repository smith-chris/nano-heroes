import { Id } from 'transforms/map'
import { Point } from 'utils/pixi'
import { terrainSize } from 'assets/const'

const offsetY = terrainSize.height
const offsetX = Math.round(terrainSize.width - 3 - offsetY / 8)

export const pointToCoordinates = (point: Point) => {
  let { x, y } = point
  const isEven = x % 2 === 1
  const result = new Point(x * offsetX, y * offsetY)
  if (isEven) {
    result.y += offsetY / 2
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
