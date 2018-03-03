import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import Redux, {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux'
import isDev from 'utils/isDev'
import { battle, BattleState } from './battle'
import genericSubscribe from './genericSubscribe'

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
  ? createStore(reducers, composeWithDevTools(applyMiddleware(logger)))
  : createStore(reducers)

export type Store = typeof store

export const subscribe = genericSubscribe(store)
