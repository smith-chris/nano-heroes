import { addCreatures } from './addCreatures'
import { Creature } from '../../creature'
import { Point } from 'utils/pixi'
import { createBattle, pointToId } from '../index'

describe('map.actions', () => {
  describe('addCreatures()', () => {
    it('should be pure and working correctly', () => {
      const battle = createBattle(4, 2)
      const creatures = {}
      const creatureToPut = new Creature(new Point(0, 0))
      const hexId = pointToId(creatureToPut.position)
      const { hexes: newHexes, creatures: newCreatures } = addCreatures(battle, [
        creatureToPut,
      ])

      expect(Boolean(newHexes[hexId].occupant)).toBe(true)
      // check if it did not modify the input values
      expect(battle.hexes[hexId].occupant).toBe(undefined)
      expect(creatures).toEqual({})
      expect(Object.keys(newCreatures).length).toBe(1)
    })
  })
})
