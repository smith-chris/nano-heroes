import { stage } from 'app/app'
import { renderMap } from 'renderers/Map'
import { store } from 'store/store'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/Creature'
import { Point } from 'transforms/Map'

store.dispatch(battleActions.loadMap({ width: 5, height: 7 }))
store.dispatch(
  battleActions.addAttackers([2, 5].map(y => new Creature(new Point(0, y))))
)
store.dispatch(
  battleActions.addDefenders([2, 5].map(y => new Creature(new Point(4, y))))
)

const map = renderMap()
stage.addChild(map)
