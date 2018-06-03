import React, { Component, ReactNode } from 'react'
import { Container } from 'react-pixi-fiber'
import HexMap from 'components/HexMap'
import Creatures from 'components/Creatures'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { uiActions } from 'store/ui'
import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'
import { getHex, Obstacle, pointsEqual } from 'transforms/map'
import { store } from 'store/store'
import { BitmapText } from 'utils/components'
import { Rectangle } from 'components/Rectangle'
import RandomGenerator from 'utils/RandomGenerator'
import { createHexHandleClick } from './createHexHandleClick'
import { models } from 'transforms/creature/models'

const random = new RandomGenerator()

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...battleActions, ...uiActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps &
  DispatchProps & {
    dev: boolean
  }

export const clickOnHex = ({ dev, ...rest }: Props, position: Point) => {
  const state = store.getState()
  createHexHandleClick({ ...rest, ...state }, getHex(state.battle.hexes, position))()
}

const makeCreature = (x: number, y: number, speed: number = 10) =>
  new Creature(new Point(x, y), speed, { ...models.pixie, speed: speed })

class Game extends Component<Props> {
  componentWillMount() {
    const {
      createMap,
      addAttackers,
      addDefenders,
      initialRound,
      battle,
      moveSelectedStart,
      nextTurn,
      highlightTarget,
      erasePositions,
      addObstacles,
      dev,
    } = this.props
    if (dev) {
      createMap({ width: 4, height: 2 })
      addAttackers([new Creature(new Point(0, 0))])
      addDefenders([new Creature(new Point(3, 1))])
    } else {
      createMap({ width: 10, height: 5 })
      addAttackers([makeCreature(0, 1, 7), makeCreature(0, 4, 10)])
      addDefenders([makeCreature(9, 1, 7), makeCreature(9, 4, 7)])
      const obstacles = []
      for (let i = 0; i < (dev ? 2 : random.integer(3, 6)); i++) {
        const obstaclePosition = new Point(random.integer(1, 8), random.integer(0, 4))
        if (
          pointsEqual(obstaclePosition, new Point(5, 2)) ||
          pointsEqual(obstaclePosition, new Point(4, 3))
        ) {
          continue
        }
        obstacles.push(new Obstacle(obstaclePosition, 'stone'))
      }
      addObstacles(obstacles)
    }
    initialRound()
  }
  render() {
    const {
      dev,
      battle: {
        round,
        player: { current },
      },
    } = this.props
    return (
      <>
        <Rectangle width={128} height={7} alpha={0.33} />
        <BitmapText text={`Round: ${round}`} position={new Point(1, 1)} />
        <BitmapText
          text={`Player: ${current}`}
          position={new Point(127, 1)}
          anchor={new Point(1, 0)}
        />
        <Container
          x={dev ? 33 : 14}
          y={dev ? 62 : 35}
          scale={dev ? new Point(2, 2) : new Point(1, 1)}
        >
          <HexMap />
          <Creatures />
        </Container>
      </>
    ) as ReactNode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
