import { stage } from 'app/app'
import { renderMap } from 'renderers/Map'
import { store } from 'store/store'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/Creature'
import { Point } from 'transforms/Map'

store.dispatch(battleActions.loadMap({ width: 10, height: 15 }))
store.dispatch(
  battleActions.addAttackers(
    [2, 5, 8, 11, 14].map(y => new Creature(new Point(0, y)))
  )
)
store.dispatch(
  battleActions.addDefenders(
    [2, 5, 8, 11, 14].map(y => new Creature(new Point(9, y)))
  )
)

const map = renderMap(store.getState())
stage.addChild(map)
