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
import { Rectangle } from './Rectangle'
import { uiActions } from 'store/ui'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...battleActions, ...uiActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Creatures extends Component<Props> {
  getPosition(creature: Creature) {
    return pointToCoordinates(creature.position)
  }

  allAnimationsFinish = () => {
    const { changeTurn, selectNextCreature } = this.props
    changeTurn()
    selectNextCreature()
  }

  handleAttackAnimationFinish = () => {
    this.props.hitTargetCreatureEnd()
    this.allAnimationsFinish()
  }

  handleMoveAnimationFinish = () => {
    const {
      moveSelectedEnd,
      resetTarget,
      hitTargetCreature,
      ui: { attackTarget },
    } = this.props
    moveSelectedEnd()
    if (attackTarget) {
      resetTarget()
      hitTargetCreature(attackTarget)
    } else {
      this.allAnimationsFinish()
    }
  }

  render() {
    const {
      battle: { selected, attacker, defender, target },
      ui: { attackTarget },
    } = this.props

    const animateSelected = selected.path && selected.path.length > 0

    return (
      <OrderedContainer>
        {each([attacker.creatures, defender.creatures], (creature, key, index) => {
          const fadeCreature = attackTarget
            ? attackTarget !== key && selected.id !== key
            : false
          const isDefender = index === 1
          const renderCreature = (animation: Animation) => (position: Point) => (
            <Container key={key} position={position} alpha={fadeCreature ? 0.33 : 1}>
              <AnimatedSprite
                anchor={new Point(0.5, 1)}
                position={(isDefender ? subPoints : sumPoints)(
                  new Point(),
                  animation.offset,
                )}
                animation={animation}
                scale={isDefender ? new Point(-1, 1) : new Point(1, 1)}
              />
              <Container position={new Point(isDefender ? -6 : 6, 5)}>
                <Rectangle width={10} height={7} anchor={0.5} alpha={0.5} />
                <BitmapText text={creature.fullUnits} anchor={0.5} />
              </Container>
            </Container>
          )
          if (target.id && creature.id === target.id) {
            return renderCreature(
              isDefender ? SkeletonAnimation.defend : KnightAnimation.defend,
            )(this.getPosition(creature))
          } else if (target.id && creature.id === selected.id) {
            return renderCreature(
              isDefender ? SkeletonAnimation.attack : KnightAnimation.attack,
            )(this.getPosition(creature))
          } else if (
            creature.id === selected.id &&
            animateSelected &&
            selected.path
          ) {
            return (
              <Animate
                key={key}
                speed={0.5}
                path={selected.path}
                render={renderCreature(
                  isDefender ? SkeletonAnimation.walk : KnightAnimation.walk,
                )}
                onFinish={this.handleMoveAnimationFinish}
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
