import { Creature, hit } from './Creature'
import RandomGenerator from 'utils/RandomGenerator'
import { hitResults } from './vcmiHitResults'
import { Point } from 'utils/pixi'

let models = {
  infernalTroglodyte: {
    attack: 5,
    defence: 4,
    damage: {
      min: 1,
      max: 3,
    },
    health: 6,
    speed: 5,
  },
  pixie: {
    attack: 2,
    defence: 2,
    damage: {
      min: 1,
      max: 2,
    },
    health: 3,
    speed: 7,
  },
}

let random = new RandomGenerator()

describe('CreatureStack', () => {
  describe('hit()', () => {
    it('should give similar results to original VCMI implementation', () => {
      let getMedian = (array: number[]) => {
        if (!array.length) {
          return 0
        }
        var numbers = array.slice(0).sort((a, b) => a - b)
        var middle = Math.floor(numbers.length / 2)
        var isEven = numbers.length % 2 === 0
        return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle]
      }

      let getAvg = (array: number[]) => {
        return (
          array.reduce((p, c) => {
            return p + c
          }) / array.length
        )
      }

      let getResultsInfo = (array: number[]) => {
        let result = {
          min: Math.min(...array),
          max: Math.max(...array),
          median: getMedian(array),
          average: getAvg(array),
        }
        return result
      }

      type Result = {
        min: number
        max: number
        median: number
        average: number
      }

      let compareInfo = (info1: Result, info2: Result) => {
        let result = {
          minDiff: info2.min - info1.min,
          maxDiff: info1.max - info2.max,
          medDiff: Math.abs(info1.median - info2.median),
          avrDiff: Math.abs(info1.average - info2.average),
          totalDiff: 0,
        }
        let totalDiff = 0
        Object.keys(result).forEach((key: keyof typeof result) => {
          totalDiff += Math.abs(result[key])
        })
        result.totalDiff = totalDiff
        return result
      }

      let sumDiff = 0
      let minusDiff = 0
      for (let test of hitResults) {
        let originalInfo = getResultsInfo(test.results)
        let newResults = []
        for (let i = 0; i < test.results.length; i++) {
          let attacker = new Creature(
            new Point(),
            test.attacker,
            models.infernalTroglodyte,
          )

          let defender = new Creature(new Point(), test.defender, {
            ...models.pixie,
            defence: 3,
          })

          let damage = hit({ attacker, defender, random })
          newResults.push(damage)
        }

        let newInfo = getResultsInfo(newResults)
        let cmprInfo = compareInfo(originalInfo, newInfo)
        if (cmprInfo.minDiff < 0) {
          minusDiff += cmprInfo.minDiff
        }
        if (cmprInfo.maxDiff < 0) {
          minusDiff += cmprInfo.maxDiff
        }
        sumDiff += cmprInfo.totalDiff
      }
      let averageDiff = sumDiff / hitResults.length
      let averageMinusDiff = minusDiff / hitResults.length
      let diffSum = Math.abs(averageDiff) + Math.abs(averageMinusDiff)
      console.warn(diffSum)
      if (diffSum > 5) {
        throw new Error()
      }
      expect(Math.abs(averageMinusDiff)).toBeLessThan(2)
      expect(Math.abs(averageDiff)).toBeLessThan(4)
    })
  })
})
