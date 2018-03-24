import { Battle, Id } from 'transforms/map'
import { Point } from 'utils/pixi'

export type UIState = {
  attackPositions: Id[]
}

const initialState: UIState = {
  attackPositions: [],
}

type HighlightAttackTarget = {
  type: 'HighlightAttackTarget'
  data: Id[]
}

export const uiActions = {
  highlightAttackTarget: (
    data: HighlightAttackTarget['data'],
  ): HighlightAttackTarget => ({
    type: 'HighlightAttackTarget',
    data,
  }),
}

export type UIAction = HighlightAttackTarget

export const ui = (state: UIState = initialState, action: UIAction): UIState => {
  switch (action.type) {
    case 'HighlightAttackTarget':
      return {
        ...state,
        attackPositions: action.data,
      }
    default: {
      const exhaustiveCheck: never = action as never
      return state
    }
  }
}
