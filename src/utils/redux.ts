// tslint:disable no-shadowed-variable
export const data = {}

export const ActionCreator = <T extends string, D>(type: T, data?: D) => {
  if (data) {
    return { type, data }
  } else {
    return { type }
  }
}
function _Action<T extends string, D>(
  type: T,
  data: D,
): (data: D) => { type: T; data: D }
function _Action<T extends string, D>(type: T): () => { type: T }
function _Action<T extends string, D>(type: T, data?: D) {
  if (data) {
    return ActionCreator.bind(null, type)
  } else {
    return () => ActionCreator(type)
  }
}
export const Action = _Action

export type valueof<T> = T[keyof T]

export type ActionUnion<T extends { [key: string]: (d?: {}) => {} }> = ReturnType<
  valueof<T>
>

export const uiActions = {
  highlightTarget: Action('HighlightTarget', data as {
    battle: number
    hex: string
  }),
  resetTarget: Action('ResetTarget'),
  resetPositions: Action('ResetPositions'),
}

export type UIAction = ActionUnion<typeof uiActions>
