// tslint:disable no-shadowed-variable
export const data = {}

// TODO: make this less complicated!
export const _ActionCreatorInner = <T extends string, D>(type: T, data?: D) => {
  console.warn('ACTION', type)
  if (data) {
    return { type, data }
  } else {
    return { type }
  }
}
type ActionCreatorType = {
  <T extends string, D>(type: T, data: D): (data: D) => { type: T; data: D }
  <T extends string, _D>(type: T): () => { type: T }
}
export const ActionCreator: ActionCreatorType = <T extends string, D>(
  type: T,
  data?: D,
) => {
  if (data) {
    return _ActionCreatorInner.bind(null, type)
  } else {
    return _ActionCreatorInner.bind(null, type, null)
  }
}

type ActionType = {
  <T extends string, D>(type: T, data: D): { type: T; data: D }
  <T extends string, _D>(type: T): { type: T }
}
export const Action = (<T extends string, D>(type: T, data?: D) => {
  if (data) {
    return _ActionCreatorInner(type, data)
  } else {
    return _ActionCreatorInner(type)
  }
}) as ActionType

export type ValueOf<T> = T[keyof T]

type Flatten<T> = T extends Array<infer U> ? U : T

export type ActionUnion<T extends { [key: string]: (d?: {}) => {} }> = Flatten<
  ReturnType<ValueOf<T>>
>
type Union = { t: 'a' } | { t: 'b' } | { t: 'a'; d: string }
