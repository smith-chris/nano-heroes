import {
  createMap,
  Map,
  putCreatures,
  Point,
  higlightHexes,
  moveSelected,
  clearPaths,
  Id
} from 'transforms/map'
import { Creature } from 'transforms/creature'

export type Size = {
  width: number
  height: number
}

export type BattleState = Map

const initialState: BattleState = createMap(5, 5)

type LoadMap = { type: 'LoadMap'; data: Size }
type AddAttackers = { type: 'AddAttackers'; data: Creature[] }
type AddDefenders = { type: 'AddDefenders'; data: Creature[] }
type SelectCreature = { type: 'SelectCreature'; data: Id }
type MoveSelected = { type: 'MoveSelected'; data: Point }

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
  }),
  moveSelected: (data: MoveSelected['data']): MoveSelected => ({
    type: 'MoveSelected',
    data
  })
}

export type BattleAction =
  | LoadMap
  | AddAttackers
  | AddDefenders
  | SelectCreature
  | MoveSelected

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
        ...putCreatures(state, action.data)
      }
    case 'SelectCreature':
      return {
        ...state,
        hexes: higlightHexes(state, state.creatures[action.data].position),
        selected: action.data
      }
    case 'MoveSelected':
      return {
        ...moveSelected(
          { ...state, hexes: clearPaths(state.hexes) },
          action.data
        ),
        selected: null
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
