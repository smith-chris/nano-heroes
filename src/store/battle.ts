import {
  createMap,
  Map,
  putCreatures,
  Point,
  higlightHexes,
  getHex,
  Hex
} from 'transforms/map'
import { Creature } from 'transforms/creature'

export type Size = {
  width: number
  height: number
}

export type BattleState = Map & {
  selectedHex: Hex
}

const initialState: BattleState = {
  ...createMap(5, 5),
  selectedHex: null
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
        hexes: higlightHexes(state, action.data),
        selectedHex: getHex(state.hexes, action.data)
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
