import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Point, Texture } from 'pixi.js'
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
import { getCount } from 'transforms/creature/Health'

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
    this.props.attackTargetEnd()
    this.allAnimationsFinish()
  }

  handleMoveAnimationFinish = () => {
    const { moveSelectedEnd, resetTarget, attackTarget, ui } = this.props
    moveSelectedEnd()
    if (ui.attackTarget) {
      resetTarget()
      attackTarget(ui.attackTarget)
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
    const isTargetDying = target.incomingData
      ? target.incomingData.firstHPleft === 0 && target.incomingData.fullUnits === 0
      : false

    return (
      <OrderedContainer>
        {each([attacker.creatures, defender.creatures], (creature, key, index) => {
          const fadeCreature = attackTarget
            ? attackTarget !== key && selected.id !== key
            : false
          const isDefender = index === 1
          const isTarget = target.id && creature.id === target.id
          const count = getCount(creature)
          const isDead = count <= 0
          type RenderCreatureProps = {
            animation?: Animation
            texture?: Texture
            offset?: Point
          }
          const renderCreature = (
            props: RenderCreatureProps,
            onFinish?: () => void,
          ) => (position: Point) => (
            <Container key={key} position={position} alpha={fadeCreature ? 0.33 : 1}>
              <AnimatedSprite
                anchor={new Point(0.5, 1)}
                position={(isDefender ? subPoints : sumPoints)(
                  new Point(),
                  props.animation ? props.animation.offset : props.offset,
                )}
                onFinish={onFinish}
                animation={props.animation}
                texture={props.texture}
                scale={isDefender ? new Point(-1, 1) : new Point(1, 1)}
              />
              {!isDead && (
                <Container position={new Point(isDefender ? -6 : 6, 5)}>
                  <Rectangle width={9} height={7} anchor={0.5} alpha={0.5} />
                  <BitmapText text={count} anchor={0.5} />
                </Container>
              )}
            </Container>
          )
          if (isDead) {
            return renderCreature({
              texture: isDefender
                ? SkeletonAnimation.death.getLastFrameTexture()
                : KnightAnimation.death.getLastFrameTexture(),
              offset: isDefender
                ? SkeletonAnimation.death.offset
                : KnightAnimation.death.offset,
            })(this.getPosition(creature))
          } else if (isTarget && isTargetDying) {
            return renderCreature({
              animation: isDefender
                ? SkeletonAnimation.death
                : KnightAnimation.death,
            })(this.getPosition(creature))
          } else if (isTarget) {
            return renderCreature({
              animation: isDefender
                ? SkeletonAnimation.defend
                : KnightAnimation.defend,
            })(this.getPosition(creature))
          } else if (target.id && creature.id === selected.id) {
            return renderCreature(
              {
                animation: isDefender
                  ? SkeletonAnimation.attack
                  : KnightAnimation.attack,
              },
              this.handleAttackAnimationFinish,
            )(this.getPosition(creature))
          } else if (
            creature.id === selected.id &&
            animateSelected &&
            selected.path
          ) {
            return (
              <Animate
                key={key}
                speed={1.8}
                path={selected.path}
                render={renderCreature({
                  animation: isDefender
                    ? SkeletonAnimation.walk
                    : KnightAnimation.walk,
                })}
                onFinish={this.handleMoveAnimationFinish}
              />
            )
          } else {
            return renderCreature({
              animation: isDefender ? SkeletonAnimation.idle : KnightAnimation.idle,
            })(this.getPosition(creature))
          }
        })}
      </OrderedContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Creatures)
