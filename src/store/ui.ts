import { Battle, Id, getAttackPositions, Hex } from 'transforms/map'
import { ActionCreator, data, ActionsUnion, Action } from 'utils/redux'

export type UIState = {
  attackPositions?: Id[]
  attackTargetId?: Id
}

const initialState: UIState = {}

export const uiActions = {
  highlightTarget: ActionCreator('UI/HighlightTarget', data as {
    battle: Battle
    hex: Hex
  }),
  eraseTargetAndPositions: () => ({ ui }: StoreState) => [
    Boolean(ui.attackPositions || ui.attackTargetId) &&
      Action('UI/EraseTargetAndPositions'),
  ],
  erasePositions: ActionCreator('UI/ErasePositions'),
}

export type UIAction = ActionsUnion<typeof uiActions>

export const uiReducer = (state: UIState = initialState, action: UIAction): UIState => {
  switch (action.type) {
    case 'UI/HighlightTarget':
      return {
        ...state,
        attackPositions: getAttackPositions(
          action.data.battle,
          action.data.hex.position,
        ),
        ...(action.data.hex.occupant
          ? { attackTargetId: action.data.hex.occupant }
          : {}),
      }
    case 'UI/EraseTargetAndPositions': {
      const newState = { ...state }
      delete newState.attackPositions
      delete newState.attackTargetId
      return newState
    }
    case 'UI/ErasePositions': {
      const newState = { ...state }
      delete newState.attackPositions
      return newState
    }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
