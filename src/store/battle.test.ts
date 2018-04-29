import { battleReducer, battleActions } from 'store/battle'
import { store } from './store'
import { bindActionCreators } from 'redux'
import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'

const battle = () => store.getState().battle

const { loadMap, addAttackers, addDefenders } = bindActionCreators(
  battleActions,
  store.dispatch,
)

beforeEach(() => {
  loadMap({ width: 10, height: 5 })
  addAttackers([1, 4].map(y => new Creature(new Point(0, y))))
  addDefenders([1, 4].map(y => new Creature(new Point(9, y))))
})
describe('battle store', () => {
  describe('loadMap()', () => {
    it('should work', () => {
      expect(battle().bounds.right).toBe(9)
      expect(battle().bounds.bottom).toBe(4)
    })
  })
})
