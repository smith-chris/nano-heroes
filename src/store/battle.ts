import {
  createMap,
  Battle,
  moveSelected,
  clearPaths,
  Id,
  getPath,
  addAttackers,
  addDefenders,
  selectCreature,
  canMove,
  selectNextCreature,
  getSelectedCreature,
  setPreviousCreature,
  getAllCreatures,
  Obstacle,
  addObstacles,
  nextRound,
  nextTurn,
  availableCreaturesCount,
  PlayerType,
} from 'transforms/map'
import { Point } from 'utils/pixi'
import { Creature, hit } from 'transforms/creature'
import { chooseOther } from 'utils/battle'
import { ActionCreator, data, ActionsUnion, Action } from 'utils/redux'
import {
  attackTargetStart,
  attackTargetEnd,
} from 'transforms/map/actions/attackTarget'

export type Size = {
  width: number
  height: number
}

export type BattleState = Battle

const initialState: BattleState = createMap(0, 0)

export const battleActions = {
  createMap: ActionCreator('CreateMap', data as Size),
  addObstacles: ActionCreator('AddObstacles', data as Obstacle[]),
  initialRound: () => [Action('InitialRound'), Action('SelectInitialCreature')],
  nextTurn: () => ({ battle }: StoreState) => [
    availableCreaturesCount(battle) === 0 && Action('NextRound'),
    Action('NextTurn'),
    Action('SelectNextCreature'),
  ],
  addAttackers: ActionCreator('AddAttackers', data as Creature[]),
  addDefenders: ActionCreator('AddDefenders', data as Creature[]),
  moveSelected: ActionCreator('MoveSelectedStart', data as Point),
  moveSelectedEnd: ActionCreator('MoveSelectedEnd'),
  attackTarget: ActionCreator('AttackTargetStart', data as Id),
  attackTargetEnd: ActionCreator('AttackTargetEnd'),
}

export type BattleAction = ActionsUnion<typeof battleActions>

export const battleReducer = (
  state: BattleState = initialState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'CreateMap':
      return createMap(action.data.width, action.data.height)
    case 'AddObstacles':
      return { ...state, hexes: addObstacles(state.hexes, action.data) }
    case 'AddAttackers':
      return {
        ...state,
        ...addAttackers(state.attacker, state.hexes, action.data),
      }
    case 'AddDefenders':
      return {
        ...state,
        ...addDefenders(state.defender, state.hexes, action.data),
      }
    case 'InitialRound':
    case 'NextRound':
      return {
        ...state,
        ...nextRound(state),
      }
    case 'NextTurn':
      return {
        ...state,
        ...nextTurn(state),
      }
    case 'SelectInitialCreature':
    case 'SelectNextCreature':
      if (!canMove(state)) {
        return state
      }
      return {
        ...state,
        ...selectNextCreature(
          state,
          action.type === 'SelectInitialCreature' ? 'Attacker' : undefined,
        ),
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
      return {
        ...state,
        ...attackTargetStart(state, action.data),
      }
    case 'AttackTargetEnd':
      return attackTargetEnd(state)
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
