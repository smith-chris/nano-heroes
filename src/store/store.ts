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
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

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
  ? createStore(reducers, composeWithDevTools(applyMiddleware(sagaMiddleware)))
  : createStore(reducers, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

export type Store = typeof store

export const subscribe = genericSubscribe(store)
