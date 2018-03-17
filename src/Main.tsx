import React, { ReactNode, ReactType } from 'react'
import { stage } from 'app/app'
import { store } from 'store/store'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/creature'
import { Point, DisplayObject } from 'pixi.js'
import { render, Text, Container } from 'react-pixi-fiber'
import { Game } from 'components/Game'
import { Provider } from 'react-redux'
import { getCreatures } from 'transforms/map'
import { sumPoints } from 'transforms/map/point'

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage
)
store.dispatch(battleActions.loadMap({ width: 9, height: 10 }))
store.dispatch(
  battleActions.addAttackers([2, 8].map(y => new Creature(new Point(0, y))))
)
store.dispatch(
  battleActions.addDefenders([2, 8].map(y => new Creature(new Point(8, y))))
)
store.dispatch(battleActions.initialRound())

const creatures = getCreatures(store.getState().battle)
const creature = creatures[Object.keys(creatures)[1]]
setTimeout(() => {
  store.dispatch(battleActions.selectCreature(creature.id))
}, 300)

setTimeout(() => {
  store.dispatch(
    battleActions.moveSelected(sumPoints(creature.position, new Point(3, -1)))
  )
}, 1300)
