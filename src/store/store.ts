import { composeWithDevTools } from 'redux-devtools-extension'
import Redux, { createStore, combineReducers } from 'redux'
import { isDev } from 'utils/isDev'
import { battleReducer, BattleState } from './battle'
import { uiReducer, UIState } from './ui'
import genericSubscribe from './genericSubscribe'

declare global {
  type StoreState = {
    readonly battle: BattleState
    readonly ui: UIState
  }

  type Dispatch = Redux.Dispatch<StoreState>
}

export const reducers = combineReducers<StoreState>({
  battle: battleReducer,
  ui: uiReducer,
})

export const store: Redux.Store<StoreState> = isDev
  ? createStore(reducers, composeWithDevTools())
  : createStore(reducers)

export type Store = typeof store

export const subscribe = genericSubscribe(store)
