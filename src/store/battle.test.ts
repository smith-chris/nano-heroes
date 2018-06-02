import { battleActions } from 'store/battle'
import { store } from './store'
import { bindActionCreators } from 'redux'
import { Creature, getCount } from 'transforms/creature'
import { Point } from 'utils/pixi'
import { getHex, getAllCreatures } from 'transforms/map'
import { uiActions } from './ui'
import { createHexHandleClick } from 'components/createHexHandleClick'
import {
  handleMoveAnimationFinish,
  handleAttackAnimationFinish,
} from 'components/attackController'

const battle = () => store.getState().battle
const ui = () => store.getState().ui
const state = () => store.getState()

const boundActions = bindActionCreators(
  { ...battleActions, ...uiActions },
  store.dispatch,
)

const props = () => ({ ...boundActions, ...state() })

const { createMap, addAttackers, addDefenders, initialRound } = boundActions

const loadSmallMap = () => {
  createMap({ width: 4, height: 2 })
  addAttackers([new Creature(new Point(0, 0))])
  addDefenders([new Creature(new Point(3, 1))])
}

describe('battle store', () => {
  describe('loadMap()', () => {
    it('should work', () => {
      loadSmallMap()
      expect(battle().bounds.right).toEqual(3)
      expect(battle().bounds.bottom).toEqual(1)
    })
  })

  describe('initialRound()', () => {
    it('should work', () => {
      loadSmallMap()
      initialRound()
      expect(battle().hexes['3_1'].canBeAttacked).toEqual(true)
    })
  })

  describe('selectNextCreature()', () => {
    it('should not pick creature that is dead', () => {
      let defender = new Creature(new Point(3, 1), 2)
      createMap({ width: 4, height: 2 })
      addAttackers([new Creature(new Point(0, 0))])
      addDefenders([defender])
      initialRound()
      const defenderHex = getHex(battle().hexes, defender.position)
      createHexHandleClick(props(), defenderHex)()

      expect(ui().attackPositions).toEqual(['2_1', '3_0'])

      const attackFromHex = getHex(battle().hexes, new Point(2, 1))
      createHexHandleClick(props(), attackFromHex)()
      handleMoveAnimationFinish(props())
      handleAttackAnimationFinish(props())
      defender = getAllCreatures(battle())[defender.id]

      // lets check if defender is dead
      expect(getCount(defender.health)).toBe(0)

      // and if its NOT selected
      expect(battle().selected.id).not.toBe(defender.id)
    })
  })
})
