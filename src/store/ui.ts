import {
  Battle,
  Id,
  getAttackPositions,
  Hex,
} from 'transforms/map'
import { Action, data, ActionUnion } from 'utils/redux'

export type UIState = {
  attackPositions: Id[]
  attackTarget: Id
}

const initialState: UIState = {
  attackPositions: [],
  attackTarget: '',
}

export const uiActions = {
  highlightTarget: Action('HighlightTarget', data as {
    battle: Battle
    hex: Hex
  }),
  resetTarget: Action('ResetTarget'),
  resetPositions: Action('ResetPositions'),
}

export type UIAction = ActionUnion<typeof uiActions>

export const ui = (state: UIState = initialState, action: UIAction): UIState => {
  switch (action.type) {
    case 'HighlightTarget':
      return {
        ...state,
        attackPositions: getAttackPositions(
          action.data.battle,
          action.data.hex.position,
        ),
        attackTarget: action.data.hex.occupant || '',
      }
    case 'ResetTarget':
      return {
        ...state,
        attackPositions: [],
        attackTarget: '',
      }
    case 'ResetPositions':
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
