import React, { ReactNode, ReactType } from 'react'
import { stage } from 'app/app'
import { store } from 'store/store'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/creature'
import { Point, DisplayObject } from 'pixi.js'
import { render, Text, Container } from 'react-pixi-fiber'
import { Game } from 'components/Game'
import { Provider } from 'react-redux'

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage
)
store.dispatch(battleActions.loadMap({ width: 5, height: 7 }))
store.dispatch(
  battleActions.addAttackers([2, 5].map(y => new Creature(new Point(0, y))))
)
store.dispatch(
  battleActions.addDefenders([2, 5].map(y => new Creature(new Point(4, y))))
)

setTimeout(() => {
  const { creatures } = store.getState().battle
  const creature = creatures[Object.keys(creatures)[1]]
  store.dispatch(battleActions.selectCreature(creature.id))
}, 300)

setTimeout(() => {
  store.dispatch(battleActions.moveSelected(new Point(2, 4)))
}, 1300)
