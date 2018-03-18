import {
  createMap,
  Battle,
  putCreatures,
  higlightHexes,
  moveSelected,
  clearPaths,
  Id,
  getPath,
  putAttackers,
  putDefenders,
  selectCreature,
  canMove
} from 'transforms/map'
import { Point } from 'utils/pixi'
import { Creature } from 'transforms/creature'
import { resetPlayer } from 'transforms/map/battle'
import { chooseRandom, chooseOther } from 'utils/battle'
import { selectNextCreature } from 'transforms/map/map'

export type Size = {
  width: number
  height: number
}

export type BattleState = Battle

const initialState: BattleState = createMap(5, 5)

type LoadMap = { type: 'LoadMap'; data: Size }
type InitialRound = { type: 'InitialRound' }
type ChangeRound = { type: 'ChangeRound' }
type ChangeTurn = { type: 'ChangeTurn' }
type SelectNextCreature = { type: 'SelectNextCreature' }
type AddAttackers = { type: 'AddAttackers'; data: Creature[] }
type AddDefenders = { type: 'AddDefenders'; data: Creature[] }
type SelectCreature = { type: 'SelectCreature'; data: Id }
export type MoveSelectedStart = { type: 'MoveSelectedStart'; data: Point }
type MoveSelectedEnd = { type: 'MoveSelectedEnd' }

export const battleActions = {
  loadMap: (data: LoadMap['data']): LoadMap => ({ type: 'LoadMap', data }),
  initialRound: (): InitialRound => ({ type: 'InitialRound' }),
  changeRound: (): ChangeRound => ({ type: 'ChangeRound' }),
  changeTurn: (): ChangeTurn => ({ type: 'ChangeTurn' }),
  selectNextCreature: (): SelectNextCreature => ({
    type: 'SelectNextCreature'
  }),
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
  | InitialRound
  | ChangeRound
  | ChangeTurn
  | SelectNextCreature
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
    case 'InitialRound':
      return {
        ...state,
        attacker: resetPlayer(state.attacker),
        defender: resetPlayer(state.defender),
        player: {
          ...state.player,
          current: 'Attacker'
        }
      }
    case 'ChangeRound':
      return {
        ...state,
        attacker: resetPlayer(state.attacker),
        defender: resetPlayer(state.defender),
        player: {
          ...state.player,
          current: 'Attacker'
        }
      }
    case 'ChangeTurn':
      return {
        ...state,
        player: {
          ...state.player,
          current: chooseOther(state.player.current, 'Attacker', 'Defender')
        }
      }
    case 'SelectNextCreature':
      if (!canMove(state)) {
        return state
      }
      return {
        ...state,
        ...selectNextCreature(state)
      }
    case 'AddAttackers':
      return {
        ...state,
        ...putAttackers(state.attacker, state.hexes, action.data)
      }
    case 'AddDefenders':
      return {
        ...state,
        ...putDefenders(state.defender, state.hexes, action.data)
      }
    case 'SelectCreature':
      if (!canMove(state)) {
        return state
      }
      return {
        ...state,
        ...selectCreature(state, action.data)
      }
    case 'MoveSelectedStart':
      if (!canMove(state)) {
        console.warn(`You can't move at this state:`, state)
        return state
      }
      const path = getPath(state.hexes, action.data)
      if (path.length <= 1) {
        console.warn('Selected unaccessible hex to move to: ', action.data)
        return state
      }
      return {
        ...state,
        hexes: clearPaths(state.hexes),
        selected: {
          ...state.selected,
          path: getPath(state.hexes, action.data)
        }
      }
    case 'MoveSelectedEnd':
      if (!canMove(state)) {
        return state
      }
      return {
        ...moveSelected(state)
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
