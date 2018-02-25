import { Store } from './store'

type StateSlice<T> = T
type SliceState<T> = (state: StoreState) => StateSlice<T>
type Subscriber<T> = (newState: StateSlice<T>, oldState: StateSlice<T>) => void

export default (store: Store) => <T>(
  sliceState: SliceState<T>,
  subscriber: Subscriber<T>
) => {
  let currentState = sliceState(store.getState())
  store.subscribe(() => {
    const newState = sliceState(store.getState())
    if (currentState !== newState) {
      const oldState = currentState
      currentState = newState
      subscriber(newState, oldState)
    }
  })
}
