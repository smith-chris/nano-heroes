import { Battle, Id, getAttackPositions, Hex } from 'transforms/map'
import { Action, data, ActionUnion } from 'utils/redux'

export type UIState = {
  attackPositions: Id[]
  attackTargetId: Id
}

const initialState: UIState = {
  attackPositions: [],
  attackTargetId: '',
}

export const uiActions = {
  highlightTarget: Action('UI/HighlightTarget', data as {
    battle: Battle
    hex: Hex
  }),
  eraseTargetAndPositions: Action('UI/EraseTargetAndPositions'),
  erasePositions: Action('UI/ErasePositions'),
}

export type UIAction = ActionUnion<typeof uiActions>

export const uiReducer = (
  state: UIState = initialState,
  action: UIAction,
): UIState => {
  switch (action.type) {
    case 'UI/HighlightTarget':
      return {
        ...state,
        attackPositions: getAttackPositions(
          action.data.battle,
          action.data.hex.position,
        ),
        attackTargetId: action.data.hex.occupant || '',
      }
    case 'UI/EraseTargetAndPositions':
      return {
        ...state,
        attackPositions: [],
        attackTargetId: '',
      }
    case 'UI/ErasePositions':
      return {
        ...state,
        attackPositions: [],
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
