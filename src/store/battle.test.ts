import { battleReducer, battleActions } from 'store/battle'
import { store } from './store'
import { bindActionCreators } from 'redux'
import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'

const battle = () => store.getState().battle

const { loadMap, addAttackers, addDefenders, initialRound } = bindActionCreators(
  battleActions,
  store.dispatch,
)

beforeEach(() => {
  loadMap({ width: 4, height: 2 })
  addAttackers([new Creature(new Point(0, 0))])
  addDefenders([new Creature(new Point(3, 1))])
})

describe('battle store', () => {
  describe('loadMap()', () => {
    it('should work', () => {
      expect(battle().bounds.right).toEqual(3)
      expect(battle().bounds.bottom).toEqual(1)
    })
  })

  // describe('initialRound()', () => {
  //   it('should work', () => {
  //     initialRound()
  //     expect(battle().hexes['3_1'].canBeAttacked).toEqual(true)
  //   })
  // })
})
