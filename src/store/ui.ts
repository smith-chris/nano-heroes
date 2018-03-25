import {
  Battle,
  Id,
  getAttackPositions,
  getCurrentCreatures,
  Hex,
} from 'transforms/map'
import { Point } from 'utils/pixi'

export type UIState = {
  attackPositions: Id[]
  attackTarget: Id
}

const initialState: UIState = {
  attackPositions: [],
  attackTarget: '',
}

type HighlightTarget = {
  type: 'HighlightTarget'
  data: {
    battle: Battle
    hex: Hex
  }
}
type ResetTarget = { type: 'ResetTarget' }
type ResetPositions = { type: 'ResetPositions' }

export const uiActions = {
  highlightTarget: (data: HighlightTarget['data']): HighlightTarget => ({
    type: 'HighlightTarget',
    data,
  }),
  resetTarget: (): ResetTarget => ({
    type: 'ResetTarget',
  }),
  resetPositions: (): ResetPositions => ({
    type: 'ResetPositions',
  }),
}

export type UIAction = HighlightTarget | ResetTarget | ResetPositions

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
