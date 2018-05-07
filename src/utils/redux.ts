// tslint:disable no-shadowed-variable
import { ObjectOf } from 'transforms/map'
import { store } from 'store/store'

export const data = {}

// TODO: make this less complicated!
export const createActionObject = <T extends string, D>(type: T, data?: D) => {
  console.warn('ACTION', type)
  if (data) {
    return { type, data }
  } else {
    return { type }
  }
}

type Validate = (s: StoreState) => boolean

type ActionCreatorType = {
  <T extends string>(type: T, val?: Validate): () => { type: T }
  <T extends string, D>(type: T, data: D, val?: Validate): (
    data: D,
  ) => { type: T; data: D }
}
export const ActionCreator: ActionCreatorType = <T extends string, D>(
  type: T,
  data?: D | Validate,
  validate?: Validate,
) => {
  if (validate) {
    return (data: D) => {
      if (validate(store.getState())) {
        return createActionObject(type, data)
      } else {
        return { type: `@@SKIP(${type})`, data }
      }
    }
  } else if (typeof data === 'function') {
    const _validate = data
    return () => {
      if (_validate(store.getState())) {
        return createActionObject(type)
      } else {
        return { type: `@@SKIP(${type})` }
      }
    }
  } else if (data) {
    return createActionObject.bind(null, type)
  } else {
    return createActionObject.bind(null, type, null)
  }
}

type ActionType = {
  <T extends string>(type: T): { type: T }
  <T extends string, D>(type: T, data: D): { type: T; data: D }
}
export const Action = createActionObject as ActionType

export type ValueOf<T> = T[keyof T]

type Flatten<T> = T extends Array<infer U> ? U : T

export type ActionUnion<T extends { [key: string]: (d?: {}) => {} }> = Flatten<
  ReturnType<ValueOf<T>>
>
