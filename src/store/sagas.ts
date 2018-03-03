import { delay } from 'redux-saga'
import { put, takeEvery, all, call } from 'redux-saga/effects'
import { Point } from 'transforms/map'

export function* animateCreatures({ data }: { data: Point }) {
  const intervalId = yield call(
    setInterval,
    () => {
      // TODO: Animate
    },
    10
  )
  yield call(delay, 100)
  window.clearInterval(intervalId)
  yield put({ type: 'MoveSelectedEnd' })
}

export function* watchMoveSelected() {
  yield takeEvery('MoveSelected', animateCreatures)
}

export default function* rootSaga() {
  yield all([watchMoveSelected()])
}
