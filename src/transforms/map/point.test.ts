import { Point } from 'utils/pixi'
import { calculateStep, pointsEqual, roundPoint } from './point'

const random = () => Math.round(Math.random() * 50)
const randomPoint = () => new Point(random(), random())

describe('transforms/map/point', () => {
  describe('transitionBetween()', () => {
    it('should work', () => {
      const input = {
        from: new Point(0, 0),
        to: new Point(10, 10),
      }
      const output = new Point(0.5, 0.5)
      expect(calculateStep(input)).toEqual(output)
      expect(calculateStep({ ...input, speed: 4.5 })).toEqual(new Point(2.25, 2.25))

      expect(
        calculateStep({
          from: new Point(49, 39),
          to: new Point(49, 39),
        }),
      ).toEqual(new Point(0, 0))

      for (let i = 0; i <= 10000; i++) {
        const randomInput = {
          speed: random(),
          from: randomPoint(),
          to: randomPoint(),
        }
        const step = calculateStep(randomInput)
        const expectedSpeed = 1
        const outputSpeed = Math.abs(step.x) + Math.abs(step.y)

        let speedDiff
        if (pointsEqual(randomInput.from, randomInput.to)) {
          speedDiff = 0
        } else {
          speedDiff = Math.abs(outputSpeed - randomInput.speed)
        }

        if (speedDiff >= 0.0000000000001 || isNaN(speedDiff)) {
          console.warn(randomInput)
        }

        // We have to account for floating point precision error
        expect(speedDiff).toBeLessThan(0.0000000000001)
      }
    })
    const simulateTransition = (from: Point, to: Point) => {
      const step = calculateStep({ speed: 0.7, from, to })
      let i = 0
      while (true) {
        i++
        if (i >= 1000) {
          console.warn('You missed the point!')
          return false
        }
        from.x += step.x
        from.y += step.y
        if (pointsEqual(roundPoint(from), to)) {
          return true
        }
      }
    }
    it('should not miss the destination point', () => {
      const from1 = new Point(11, -10)
      const to1 = new Point(101, -132)
      expect(simulateTransition(from1, to1)).toEqual(true)
      const from2 = new Point(0, 32)
      const to2 = new Point(12, 36)
      expect(simulateTransition(from2, to2)).toEqual(true)
    })
  })
})
