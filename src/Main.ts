import { stage } from 'app/app'
import { Game } from 'components/Game'
import { store } from 'store/store'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/creature'
import { Point } from 'transforms/map'

store.dispatch(battleActions.loadMap({ width: 5, height: 7 }))
store.dispatch(
  battleActions.addAttackers([2, 5].map(y => new Creature(new Point(0, y))))
)
store.dispatch(
  battleActions.addDefenders([2, 5].map(y => new Creature(new Point(4, y))))
)

const map = Game()

stage.addChild(map)
