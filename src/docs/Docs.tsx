import React, { Component } from 'react'
import { battleReducer, battleActions } from 'store/battle'
import { Creature } from 'transforms/creature'
import { Point } from 'pixi.js'
import { reducers } from 'store/store'
import { Provider } from 'react-redux'
import { createDevTools } from 'redux-devtools'
import { createStore } from 'redux'
import Inspector from 'redux-devtools-inspector'

const DevTools = createDevTools(<Inspector select={state => state.battle} />)

const store: Redux.Store<StoreState> = createStore(reducers, DevTools.instrument())

store.dispatch(
  battleActions.addAttackers([1, 2].map(y => new Creature(new Point(0, y)))),
)

export class Docs extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <DevTools theme={'inspector'} shouldPersistState invertTheme={true} />
        </Provider>
      </div>
    )
  }
}
