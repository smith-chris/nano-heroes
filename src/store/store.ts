import logger from 'redux-logger'
import Redux, { createStore, applyMiddleware, combineReducers } from 'redux'
import isDev from 'utils/isDev'

import { map, BattleState, BattleAction } from './battle'

declare global {
  type StoreState = {
    readonly map: BattleState
  }

  type Dispatch = Redux.Dispatch<StoreState>
}

const reducers = combineReducers<StoreState>({
  map
})

export const store: Redux.Store<StoreState> = isDev
  ? createStore(reducers, applyMiddleware(logger))
  : createStore(reducers)
