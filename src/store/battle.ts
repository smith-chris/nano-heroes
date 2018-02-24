import { createMap, Map } from 'transforms/Map'
import { Creature } from 'transforms/Creatures'

export type Size = {
  width: number
  height: number
}

export type BattleState = Map & {
  attackers: Creature[]
  defenders: Creature[]
}
const initialState: BattleState = {
  ...createMap(5, 5),
  attackers: [],
  defenders: []
}

type AddAttackers = { type: 'AddAttackers'; data: Creature[] }
type AddDefenders = { type: 'AddDefenders'; data: Creature[] }
type LoadMap = { type: 'LoadMap'; data: Size }

export const battleActions = {
  loadMap: (data: LoadMap['data']): LoadMap => ({ type: 'LoadMap', data }),
  addAttackers: (data: AddAttackers['data']): AddAttackers => ({
    type: 'AddAttackers',
    data
  }),
  addDefenders: (data: AddDefenders['data']): AddDefenders => ({
    type: 'AddDefenders',
    data
  })
}

export type BattleAction = LoadMap | AddAttackers | AddDefenders

type Reducer = (state: BattleState, action: BattleAction) => BattleState
export const map: Reducer = (state = initialState, action) => {
  const { data } = action
  switch (action.type) {
    case 'LoadMap':
      return { ...state, ...createMap(action.data.width, action.data.height) }
    case 'AddAttackers':
      return { ...state, attackers: [...state.attackers, ...action.data] }
    case 'AddDefenders':
      return { ...state, defenders: [...state.defenders, ...action.data] }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
