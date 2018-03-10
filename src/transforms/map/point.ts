import { Point } from 'utils/pixi'

export const pointsEqual = (pA: Point, pB: Point) =>
  pA.x === pB.x && pA.y === pB.y

type transitionData = {
  speed?: number
  from: Point
  to: Point
}
export const calculateStep = ({ speed = 1, from, to }: transitionData) => {
  const width = to.x - from.x
  const height = to.y - from.y
  const total = Math.abs(width) + Math.abs(height)
  if (total === 0) { return new Point(0, 0) }
  return new Point(width / total * speed, height / total * speed)
}
