// tslint:disable no-shadowed-variable
export const data = {}

export const ActionCreator = <T extends string, D>(type: T, data?: D) => {
  // console.warn('ACTION', type)
  if (data) {
    return { type, data }
  } else {
    return { type }
  }
}
type ActionType = {
  <T extends string, D>(type: T, data: D): (data: D) => { type: T; data: D }
  <T extends string, _D>(type: T): () => { type: T }
}
const _Action: ActionType = <T extends string, D>(type: T, data?: D) => {
  if (data) {
    return ActionCreator.bind(null, type)
  } else {
    return ActionCreator.bind(null, type, null)
  }
}
export const Action = _Action

export type valueof<T> = T[keyof T]

export type ActionUnion<T extends { [key: string]: (d?: {}) => {} }> = ReturnType<
  valueof<T>
>
