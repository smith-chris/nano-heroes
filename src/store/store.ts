import { composeWithDevTools } from 'redux-devtools-extension'
import Redux, { createStore, combineReducers, applyMiddleware } from 'redux'
import { battleReducer, BattleState } from './battle'
import { uiReducer, UIState } from './ui'
import genericSubscribe from './genericSubscribe'
import { transformActions } from 'utils/redux'

declare global {
  type StoreState = {
    readonly battle: BattleState
    readonly ui: UIState
  }

  type Store = Redux.Store<StoreState>

  type Dispatch = Redux.Dispatch<StoreState>
}

export const reducers = combineReducers<StoreState>({
  battle: battleReducer,
  ui: uiReducer,
})

export const store: Store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(transformActions)),
)
export const subscribe = genericSubscribe(store)
