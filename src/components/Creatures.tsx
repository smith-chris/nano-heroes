import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Point, Texture } from 'pixi.js'
import { Container } from 'react-pixi-fiber'
import { each, getTargetCreature, getSelectedCreature } from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { Creature, getCount } from 'transforms/creature'
import { Animate } from './Animate'
import { OrderedContainer } from './OrderedContainer'
import { AnimatedSprite } from './AnimatedSprite'
import { KnightAnimation, SkeletonAnimation, Animation } from 'assets/animation'
import { BitmapText } from 'utils/components'
import { Rectangle } from './Rectangle'
import { uiActions } from 'store/ui'
import * as attackController from './attackController'

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

  handleAttackAnimationFinish = () => {
    attackController.handleAttackAnimationFinish(this.props)
  }

  handleMoveAnimationFinish = () => {
    attackController.handleMoveAnimationFinish(this.props)
  }

  render() {
    const {
      battle,
      ui: { attackTargetId },
    } = this.props
    const { selected, attacker, defender, target } = battle

    const animateSelected = selected.path && selected.path.length > 0
    const isTargetDying = target.incomingData
      ? getCount(target.incomingData) <= 0
      : false

    return (
      <OrderedContainer>
        {each([attacker.creatures, defender.creatures], (creature, key, index) => {
          const count = getCount(creature)

          const defenderCreatures = index === 1

          const isAttacking = target.id && creature.id === selected.id
          const isDefending = target.id && creature.id === target.id
          const isDying = isDefending && isTargetDying
          const isDead = count <= 0

          const fadeCreature =
            (attackTargetId
              ? attackTargetId !== key && selected.id !== key
              : false) || isDead

          type RenderCreatureProps = {
            animation?: Animation
            texture?: Texture
            offset?: Point
          }
          const renderCreature = (
            props: RenderCreatureProps,
            onFinish?: () => void,
          ) => (position: Point, dirLeft = defenderCreatures) => {
            const offset = props.animation ? props.animation.offset : props.offset
            return (
              <Container
                key={key}
                position={position}
                alpha={fadeCreature ? 0.33 : 1}
              >
                <AnimatedSprite
                  anchor={new Point(0.5, 1)}
                  position={
                    offset && new Point(dirLeft ? -offset.x : offset.x, offset.y)
                  }
                  onFinish={onFinish}
                  animation={props.animation}
                  texture={props.texture}
                  scale={dirLeft ? new Point(-1, 1) : new Point(1, 1)}
                />
                {!isDead && (
                  <Container position={new Point(defenderCreatures ? -6 : 6, 5)}>
                    <Rectangle width={9} height={7} anchor={0.5} alpha={0.5} />
                    <BitmapText text={count} anchor={0.5} />
                  </Container>
                )}
              </Container>
            )
          }
          if (isDead) {
            return renderCreature({
              texture: defenderCreatures
                ? SkeletonAnimation.death.getLastFrameTexture()
                : KnightAnimation.death.getLastFrameTexture(),
              offset: defenderCreatures
                ? SkeletonAnimation.death.offset
                : KnightAnimation.death.offset,
            })(this.getPosition(creature))
          } else if (isDying) {
            return renderCreature({
              animation: defenderCreatures
                ? SkeletonAnimation.death
                : KnightAnimation.death,
            })(this.getPosition(creature))
          } else if (isDefending) {
            const selectedCreature = getSelectedCreature(battle)
            if (!selectedCreature) {
              return
            }
            const dirLeft = selectedCreature.position.x < creature.position.x
            return renderCreature({
              animation: defenderCreatures
                ? SkeletonAnimation.defend
                : KnightAnimation.defend,
            })(this.getPosition(creature), dirLeft)
          } else if (isAttacking) {
            const targetCreature = getTargetCreature(battle)
            if (!targetCreature) {
              return
            }
            const dirLeft = targetCreature.position.x < creature.position.x
            return renderCreature(
              {
                animation: defenderCreatures
                  ? SkeletonAnimation.attack
                  : KnightAnimation.attack,
              },
              this.handleAttackAnimationFinish,
            )(this.getPosition(creature), dirLeft)
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
                  animation: defenderCreatures
                    ? SkeletonAnimation.walk
                    : KnightAnimation.walk,
                })}
                onFinish={this.handleMoveAnimationFinish}
              />
            )
          } else {
            return renderCreature({
              animation: defenderCreatures
                ? SkeletonAnimation.idle
                : KnightAnimation.idle,
            })(this.getPosition(creature))
          }
        })}
      </OrderedContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Creatures)
