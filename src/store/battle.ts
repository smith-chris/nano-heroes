import {
  createMap,
  Battle,
  moveSelected,
  clearPaths,
  Id,
  getPath,
  putAttackers,
  putDefenders,
  selectCreature,
  canMove,
} from 'transforms/map'
import { Point } from 'utils/pixi'
import { Creature } from 'transforms/creature'
import { resetPlayer } from 'transforms/map/battle'
import { chooseOther } from 'utils/battle'
import { selectNextCreature, canAttack } from 'transforms/map/map'
import { Action, data, ActionUnion } from 'utils/redux'

export type Size = {
  width: number
  height: number
}

export type BattleState = Battle

const initialState: BattleState = createMap(5, 5)

export const battleActions = {
  loadMap: Action('LoadMap', data as Size),
  initialRound: Action('InitialRound'),
  changeRound: Action('ChangeRound'),
  changeTurn: Action('ChangeTurn'),
  selectNextCreature: Action('SelectNextCreature'),
  addAttackers: Action('AddAttackers', data as Creature[]),
  addDefenders: Action('AddDefenders', data as Creature[]),
  selectCreature: Action('SelectCreature', data as Id),
  moveSelected: Action('MoveSelectedStart', data as Point),
  moveSelectedEnd: Action('MoveSelectedEnd'),
  hitTargetCreature: Action('HitTargetCreatureStart', data as Id),
  hitTargetCreatureEnd: Action('HitTargetCreatureEnd'),
}

export type BattleAction = ActionUnion<typeof battleActions>

export const battle = (
  state: BattleState = initialState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'LoadMap':
      return {
        ...initialState,
        ...createMap(action.data.width, action.data.height),
      }
    case 'InitialRound':
      return {
        ...state,
        attacker: resetPlayer(state.attacker),
        defender: resetPlayer(state.defender),
        player: {
          ...state.player,
          current: 'Attacker',
        },
      }
    case 'ChangeRound':
      return {
        ...state,
        attacker: resetPlayer(state.attacker),
        defender: resetPlayer(state.defender),
        player: {
          ...state.player,
          current: 'Attacker',
        },
      }
    case 'ChangeTurn':
      return {
        ...state,
        player: {
          ...state.player,
          current: chooseOther(state.player.current, 'Attacker', 'Defender'),
        },
      }
    case 'SelectNextCreature':
      if (!canMove(state)) {
        return state
      }
      return {
        ...state,
        ...selectNextCreature(state),
      }
    case 'AddAttackers':
      return {
        ...state,
        ...putAttackers(state.attacker, state.hexes, action.data),
      }
    case 'AddDefenders':
      return {
        ...state,
        ...putDefenders(state.defender, state.hexes, action.data),
      }
    case 'SelectCreature':
      if (!canMove(state)) {
        return state
      }
      return {
        ...state,
        ...selectCreature(state, action.data),
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
          path,
        },
      }
    case 'MoveSelectedEnd':
      if (!canMove(state)) {
        return state
      }
      return {
        ...moveSelected(state),
      }
    case 'HitTargetCreatureStart':
      if (!canAttack(state, action.data)) {
        console.warn(`You can't attack this creature: `, action.data, state)
        return state
      }
      return {
        ...state,
        target: {
          id: action.data,
        },
      }
    case 'HitTargetCreatureEnd':
      return {
        ...state,
        target: {},
        selected: {},
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
