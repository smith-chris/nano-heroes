import { addCreatures } from './addCreatures'
import { Creature } from '../../creature'
import { Point } from 'utils/pixi'
import { createMap, pointToId, getHex } from '../index'

describe('map.actions', () => {
  describe('addCreatures()', () => {
    it('should be pure and working correctly', () => {
      const { hexes } = createMap(4, 2)
      const creatures = {}
      const creatureToPut = new Creature(new Point(0, 0))
      const hexId = pointToId(creatureToPut.position)
      const [newHexes, newCreatures] = addCreatures(creatures, hexes, [
        creatureToPut,
      ])

      expect(Boolean(newHexes[hexId].occupant)).toBe(true)
      // check if it did not modify the input values
      expect(hexes[hexId].occupant).toBe(undefined)
      expect(creatures).toEqual({})
      expect(Object.keys(newCreatures).length).toBe(1)
    })
  })
})
