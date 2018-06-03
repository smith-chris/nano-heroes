import {
  createBattle,
  Battle,
  moveSelectedEnd,
  Id,
  addAttackers,
  addDefenders,
  selectNextCreature,
  Obstacle,
  addObstacles,
  nextRound,
  nextTurn,
  availableCreaturesCount,
  moveSelectedStart,
} from 'transforms/map'
import { Point } from 'utils/pixi'
import { Creature } from 'transforms/creature'
import { ActionCreator, data, ActionsUnion, Action } from 'utils/redux'
import { attackTargetStart, attackTargetEnd } from 'transforms/map/actions/attackTarget'

export type Size = {
  width: number
  height: number
}

export type BattleState = Battle

const initialState: BattleState = createBattle(0, 0)

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
  moveSelectedStart: ActionCreator('MoveSelectedStart', data as Point),
  moveSelectedEnd: ActionCreator('MoveSelectedEnd'),
  attackTargetStart: ActionCreator('AttackTargetStart', data as Id),
  attackTargetEnd: ActionCreator('AttackTargetEnd'),
}

export type BattleAction = ActionsUnion<typeof battleActions>

export const battleReducer = (
  state: BattleState = initialState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'CreateMap':
      return createBattle(action.data.width, action.data.height)
    case 'AddObstacles':
      return { ...state, hexes: addObstacles(state.hexes, action.data) }
    case 'AddAttackers':
      return {
        ...state,
        ...addAttackers(state, action.data),
      }
    case 'AddDefenders':
      return {
        ...state,
        ...addDefenders(state, action.data),
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
      return {
        ...state,
        ...selectNextCreature(
          state,
          action.type === 'SelectInitialCreature' ? 'Attacker' : undefined,
        ),
      }
    case 'MoveSelectedStart':
      return moveSelectedStart(state, action.data)
    case 'MoveSelectedEnd':
      return moveSelectedEnd(state)
    case 'AttackTargetStart':
      return {
        ...state,
        ...attackTargetStart(state, action.data),
      }
    case 'AttackTargetEnd':
      return { ...state, ...attackTargetEnd(state) }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
