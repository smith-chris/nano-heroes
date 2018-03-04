import { delay } from 'redux-saga'
import { put, takeEvery, all, call } from 'redux-saga/effects'
import { Point } from 'transforms/map'
import { events } from 'components/CreatureMap'
import { MoveSelectedStart } from './battle'

export function* moveCreatureSaga({ data }: { data: Point }) {
  if (events.moveCreature) {
    yield call(events.moveCreature, data)
    yield put({ type: 'MoveSelectedEnd', data })
  }
}

export function* watchMoveSelected() {
  yield takeEvery<MoveSelectedStart>('MoveSelectedStart', moveCreatureSaga)
}

export default function* rootSaga() {
  yield all([watchMoveSelected()])
}
