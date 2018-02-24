import {
  createMap,
  Map,
  putCreatures,
  Point,
  higlightHexes
} from 'transforms/Map'
import { Creature } from 'transforms/Creature'

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

type LoadMap = { type: 'LoadMap'; data: Size }
type AddAttackers = { type: 'AddAttackers'; data: Creature[] }
type AddDefenders = { type: 'AddDefenders'; data: Creature[] }
type SelectCreature = { type: 'SelectCreature'; data: Point }

export const battleActions = {
  loadMap: (data: LoadMap['data']): LoadMap => ({ type: 'LoadMap', data }),
  addAttackers: (data: AddAttackers['data']): AddAttackers => ({
    type: 'AddAttackers',
    data
  }),
  addDefenders: (data: AddDefenders['data']): AddDefenders => ({
    type: 'AddDefenders',
    data
  }),
  selectCreature: (data: SelectCreature['data']): SelectCreature => ({
    type: 'SelectCreature',
    data
  })
}

export type BattleAction =
  | LoadMap
  | AddAttackers
  | AddDefenders
  | SelectCreature

type Reducer = (state: BattleState, action: BattleAction) => BattleState
export const battle: Reducer = (state = initialState, action) => {
  const { data } = action
  switch (action.type) {
    case 'LoadMap':
      return {
        ...initialState,
        ...createMap(action.data.width, action.data.height)
      }
    case 'AddAttackers':
    case 'AddDefenders':
      return {
        ...state,
        hexes: putCreatures(state.hexes, action.data)
      }
    case 'SelectCreature':
      return {
        ...state,
        hexes: higlightHexes(state, action.data)
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
