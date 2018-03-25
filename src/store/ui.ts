import { Battle, Id, getAttackPositions, getCreatures, Hex } from 'transforms/map'
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

export const uiActions = {
  highlightTarget: (data: HighlightTarget['data']): HighlightTarget => ({
    type: 'HighlightTarget',
    data,
  }),
  resetTarget: (): ResetTarget => ({
    type: 'ResetTarget',
  }),
}

export type UIAction = HighlightTarget | ResetTarget

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
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
