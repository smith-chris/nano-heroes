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
  selectNextCreature,
  getSelectedCreature,
  setPreviousCreature,
  getAllCreatures,
  Obstacle,
  putObstacles,
} from 'transforms/map'
import { Point } from 'utils/pixi'
import { Creature, hit } from 'transforms/creature'
import { chooseOther } from 'utils/battle'
import { Action, data, ActionUnion } from 'utils/redux'

export type Size = {
  width: number
  height: number
}

export type BattleState = Battle

const initialState: BattleState = createMap(5, 5)

export const battleActions = {
  loadMap: Action('LoadMap', data as Size),
  putObstacles: Action('PutObstacles', data as Obstacle[]),
  initialRound: Action('InitialRound'),
  finishTurn: Action('FinishTurn'),
  addAttackers: Action('AddAttackers', data as Creature[]),
  addDefenders: Action('AddDefenders', data as Creature[]),
  selectCreature: Action('SelectCreature', data as Id),
  moveSelected: Action('MoveSelectedStart', data as Point),
  moveSelectedEnd: Action('MoveSelectedEnd'),
  attackTarget: Action('AttackTargetStart', data as Id),
  attackTargetEnd: Action('AttackTargetEnd'),
}

export type BattleAction = ActionUnion<typeof battleActions>

export const battleReducer = (
  state: BattleState = initialState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'LoadMap':
      return {
        ...initialState,
        ...createMap(action.data.width, action.data.height),
      }
    case 'PutObstacles':
      return { ...state, hexes: putObstacles(state.hexes, action.data) }
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
    case 'InitialRound':
      return selectNextCreature(state, state.player.current)
    case 'FinishTurn':
      return selectNextCreature(
        state,
        chooseOther(state.player.current, 'Attacker', 'Defender'),
      )
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
    case 'AttackTargetStart':
      const target = getAllCreatures(state)[action.data]
      const selected = getSelectedCreature(state)
      if (!(target && selected)) {
        console.warn(
          `${!target ? 'Target' : 'Selected'} not available in state: ${state}`,
        )
        return state
      } else {
        const [incomingData] = hit({
          defender: target,
          attacker: selected,
        })
        return {
          ...state,
          target: {
            id: action.data,
            incomingData,
          },
        }
      }
    case 'AttackTargetEnd':
      if (!state.target.incomingData) {
        return state
      }
      return {
        ...setPreviousCreature(state, state.target.incomingData),
        target: {},
        selected: {},
      }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
