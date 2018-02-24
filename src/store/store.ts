import logger from 'redux-logger'
import Redux, { createStore, applyMiddleware, combineReducers } from 'redux'
import isDev from 'utils/isDev'
import { battle, BattleState } from './battle'
import genericSubscribe from './subscribe'

declare global {
  type StoreState = {
    readonly battle: BattleState
  }

  type Dispatch = Redux.Dispatch<StoreState>
}

const reducers = combineReducers<StoreState>({
  battle
})

export const store: Redux.Store<StoreState> = isDev
  ? createStore(reducers, applyMiddleware(logger))
  : createStore(reducers)

export type Store = typeof store

export const subscribe = genericSubscribe(store)
