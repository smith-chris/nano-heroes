import { delay } from 'redux-saga'
import { put, takeEvery, all, call } from 'redux-saga/effects'
import { Point } from 'transforms/map'
import { moveCreature } from 'components/CreatureMap'

export function* moveCreatureSaga({ data }: { data: Point }) {
  yield call(moveCreature, data)
  yield put({ type: 'MoveSelectedEnd', data })
}

export function* watchMoveSelected() {
  yield takeEvery('MoveSelectedStart', moveCreatureSaga)
}

export default function* rootSaga() {
  yield all([watchMoveSelected()])
}
