import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Point } from 'pixi.js'
import { Container } from 'react-pixi-fiber'
import { each } from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/creature'
import { Animate } from './Animate'
import { OrderedContainer } from './OrderedContainer'
import { AnimatedSprite } from './AnimatedSprite'
import { KnightAnimation, SkeletonAnimation, Animation } from 'assets/animation'
import { sumPoints, subPoints } from 'transforms/map/point'
import { BitmapText } from 'utils/components'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(battleActions, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Creatures extends Component<Props> {
  getPosition(creature: Creature) {
    return pointToCoordinates(creature.position)
  }

  handleAnimationFinish = () => {
    this.props.moveSelectedEnd()
    this.props.changeTurn()
    this.props.selectNextCreature()
  }

  render() {
    const { battle: { selected, attacker, defender } } = this.props
    const animateSelected = selected.path && selected.path.length > 0

    return (
      <OrderedContainer>
        {each([attacker.creatures, defender.creatures], (creature, key, index) => {
          const isDefender = index === 1
          const renderCreature = (animation: Animation) => (position: Point) => (
            <Container key={key} position={position}>
              <BitmapText text={creature.fullUnits} />
              <AnimatedSprite
                anchor={new Point(0.5, 1)}
                position={(isDefender ? subPoints : sumPoints)(
                  new Point(),
                  animation.offset,
                )}
                animation={animation}
                scale={isDefender ? new Point(-1, 1) : new Point(1, 1)}
              />
            </Container>
          )
          if (creature.id === selected.id && animateSelected && selected.path) {
            return (
              <Animate
                key={key}
                speed={0.5}
                path={selected.path}
                render={renderCreature(
                  isDefender ? SkeletonAnimation.walk : KnightAnimation.walk,
                )}
                onFinish={this.handleAnimationFinish}
              />
            )
          } else {
            return renderCreature(
              isDefender ? SkeletonAnimation.idle : KnightAnimation.idle,
            )(this.getPosition(creature))
          }
        })}
      </OrderedContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Creatures)
