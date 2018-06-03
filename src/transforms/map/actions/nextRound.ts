import mapValues from 'lodash.mapvalues'
import { Battle, Player } from '../types'
import { getCount } from '../../creature'

export const nextRound = ({ creatures, round }: Battle) => {
  return {
    round: round + 1,
    creatures: mapValues(creatures, creature => {
      const result = { ...creature }
      delete result.hasMoved
      return result
    }),
  }
}
