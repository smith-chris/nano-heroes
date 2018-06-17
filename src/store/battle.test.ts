import { battleActions } from 'store/battle'
import { store } from './store'
import { bindActionCreators } from 'redux'
import { Creature, getCount } from 'transforms/creature'
import { Point } from 'utils/pixi'
import { getHex, xyToId } from 'transforms/map'
import { uiActions } from './ui'
import { createHexHandleClick } from 'components/createHexHandleClick'
import {
  handleMoveAnimationFinish,
  handleAttackAnimationFinish,
} from 'components/attackController'

const getBattle = () => store.getState().battle
const getUi = () => store.getState().ui
const getState = () => store.getState()

const boundActions = bindActionCreators(
  { ...battleActions, ...uiActions },
  store.dispatch,
)

const getProps = () => ({ ...boundActions, ...getState() })

const { createMap, addAttackers, addDefenders, initialRound } = boundActions

const loadSmallMap = ({ defenderAmount = 10 } = {}) => {
  const attacker = new Creature(new Point(0, 0))
  const defender = new Creature(new Point(3, 1), defenderAmount)
  createMap({ width: 4, height: 2 })
  addAttackers([attacker])
  addDefenders([defender])
  return { getDefender: () => getBattle().creatures[defender.id] }
}

describe('battle store', () => {
  describe('loadMap()', () => {
    it('should work', () => {
      loadSmallMap()
      expect(getBattle().bounds.right).toEqual(3)
      expect(getBattle().bounds.bottom).toEqual(1)
    })
  })

  describe('initialRound()', () => {
    it('should work', () => {
      loadSmallMap()
      initialRound()
      expect(getBattle().hexes[xyToId(3, 1)].canBeAttacked).toEqual(true)
    })
  })

  describe('selectNextCreature()', () => {
    it('should not pick creature that is dead', () => {
      const { getDefender } = loadSmallMap({ defenderAmount: 2 })
      initialRound()
      const defenderHex = getHex(getBattle().hexes, getDefender().position)
      createHexHandleClick(getProps(), defenderHex)()

      expect(getUi().attackPositions).toEqual([xyToId(2, 1), xyToId(3, 0)])

      const attackFromHex = getHex(getBattle().hexes, new Point(2, 1))
      createHexHandleClick(getProps(), attackFromHex)()
      handleMoveAnimationFinish(getProps())
      handleAttackAnimationFinish(getProps())

      // lets check if defender is dead
      expect(getCount(getDefender().health)).toBe(0)

      // and if its NOT selected
      expect(getBattle().selected.id).not.toBe(getDefender().id)
    })
  })
})
