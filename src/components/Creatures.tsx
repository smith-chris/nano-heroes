import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Sprite } from 'react-pixi-fiber'
import { Texture, Point } from 'pixi.js'
import { HashMap, each, Id } from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import char1 from 'assets/char1.png'
import { Creature } from 'transforms/creature'
import { Animate } from './Animate'
import { OrderedContainer } from './OrderedContainer'
import { AnimatedSprite } from './AnimatedSprite'
import { KnightAnimation, Animation } from 'assets/animation'
import { sumPoints } from 'transforms/map/point'

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
        {each(
          [attacker.creatures, defender.creatures],
          (creature, key, index) => {
            const renderCreature = (animation?: Animation) => (
              position: Point
            ) => (
              <AnimatedSprite
                key={key}
                anchor={new Point(0.5, 1)}
                position={sumPoints(position, animation.offset)}
                animation={animation}
                scale={index === 1 ? new Point(-1, 1) : new Point(1, 1)}
              />
            )
            if (creature.id === selected.id && animateSelected) {
              return (
                <Animate
                  key={key}
                  speed={0.5}
                  path={selected.path}
                  render={renderCreature(KnightAnimation.walk)}
                  onFinish={this.handleAnimationFinish}
                />
              )
            } else {
              return renderCreature(KnightAnimation.idle)(
                this.getPosition(creature)
              )
            }
          }
        )}
      </OrderedContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Creatures)
