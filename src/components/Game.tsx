import React, { Component, ReactNode } from 'react'
import { Container } from 'react-pixi-fiber'
import HexMap, { createHexHandleClick } from 'components/HexMap'
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

const clickOnHex = ({ dev, ...rest }: Props, position: Point) => {
  const state = store.getState()
  createHexHandleClick({ ...rest, ...state }, getHex(state.battle.hexes, position))()
}

class Game extends Component<Props> {
  componentWillMount() {
    const {
      loadMap,
      addAttackers,
      addDefenders,
      initialRound,
      battle,
      moveSelected,
      finishTurn,
      highlightTarget,
      erasePositions,
      putObstacles,
      dev,
    } = this.props
    loadMap({ width: 10, height: 5 })
    addAttackers((dev ? [1] : [1, 4]).map(y => new Creature(new Point(0, y))))
    addDefenders((dev ? [1] : [1, 4]).map(y => new Creature(new Point(9, y))))
    const obstacles = []
    for (let i = 0; i < random.integer(3, 6); i++) {
      const obstaclePosition = new Point(random.integer(1, 8), random.integer(0, 4))
      if (
        pointsEqual(obstaclePosition, new Point(5, 2)) ||
        pointsEqual(obstaclePosition, new Point(4, 3))
      ) {
        continue
      }
      obstacles.push(new Obstacle(obstaclePosition, 'stone'))
    }
    putObstacles(obstacles)
    initialRound()
    if (!dev) {
      return
    }
    setTimeout(() => {
      clickOnHex(this.props, new Point(5, 2))
    }, 300)
    setTimeout(() => {
      clickOnHex(this.props, new Point(5, 2))
    }, 1400)
    setTimeout(() => {
      clickOnHex(this.props, new Point(4, 3))
    }, 1700)
    setTimeout(() => {
      clickOnHex(this.props, new Point(4, 3))
    }, 4300)
    setTimeout(() => {
      clickOnHex(this.props, new Point(5, 2))
    }, 4600)
  }
  render() {
    const { battle: { round, player: { current } } } = this.props
    return (
      <>
        <Rectangle width={128} height={7} alpha={0.33} />
        <BitmapText text={`Round: ${round}`} position={new Point(1, 1)} />
        <BitmapText
          text={`Player: ${current}`}
          position={new Point(127, 1)}
          anchor={new Point(1, 0)}
        />
        <Container x={14} y={35}>
          <HexMap />
          <Creatures />
        </Container>
      </>
    ) as ReactNode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
