import {
  createMap,
  Map,
  putCreatures,
  higlightHexes,
  moveSelected,
  clearPaths,
  Id,
  getPath
} from 'transforms/map'
import { Point } from 'utils/pixi'
import { Creature } from 'transforms/creature'
import { putAttackers, putDefenders, selectCreature } from 'transforms/map/map'

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
export type MoveSelectedStart = { type: 'MoveSelectedStart'; data: Point }
type MoveSelectedEnd = { type: 'MoveSelectedEnd' }

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
  moveSelected: (data: MoveSelectedStart['data']): MoveSelectedStart => ({
    type: 'MoveSelectedStart',
    data
  }),
  moveSelectedEnd: (): MoveSelectedEnd => ({
    type: 'MoveSelectedEnd'
  })
}

export type BattleAction =
  | LoadMap
  | AddAttackers
  | AddDefenders
  | SelectCreature
  | MoveSelectedStart
  | MoveSelectedEnd

type Reducer = (state: BattleState, action: BattleAction) => BattleState
export const battle: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LoadMap':
      return {
        ...initialState,
        ...createMap(action.data.width, action.data.height)
      }
    case 'AddAttackers':
      return {
        ...state,
        ...putAttackers(state.attackers, state.hexes, action.data)
      }
    case 'AddDefenders':
      return {
        ...state,
        ...putDefenders(state.defenders, state.hexes, action.data)
      }
    case 'SelectCreature':
      return {
        ...state,
        ...selectCreature(state, action.data)
      }
    case 'MoveSelectedStart':
      return {
        ...state,
        hexes: clearPaths(state.hexes),
        selected: {
          ...state.selected,
          path: getPath(state.hexes, action.data)
        }
      }
    case 'MoveSelectedEnd':
      return {
        ...moveSelected(state)
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
