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

type Props = StateProps & ActionProps

class CreatureComponent extends Component<Props> {
  getPosition(creature: Creature) {
    return pointToCoordinates(creature.position)
  }

  createHandleClick = (id: Id) => () => {
    const { selectCreature } = this.props
    selectCreature(id)
  }

  createRenderCreature = (key: string) => (animation?: Animation) => (
    position: Point
  ) => (
    <AnimatedSprite
      interactive
      key={key}
      pointerdown={this.createHandleClick(key)}
      anchor={new Point(0.5, 1)}
      position={sumPoints(position, animation.offset)}
      animation={animation}
    />
  )

  handleAnimationFinish = () => {
    this.props.moveSelectedEnd()
  }

  render() {
    const { battle: { selected, attacker, defender } } = this.props
    const animateSelected = selected.path && selected.path.length > 0

    return (
      <OrderedContainer>
        {each([attacker.creatures, defender.creatures], (creature, key) => {
          const renderCreature = this.createRenderCreature(key)
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
        })}
      </OrderedContainer>
    )
  }
}

type StateProps = StoreState
const mapStateToProps = (state: StoreState): StateProps => state

type ActionProps = typeof battleActions
const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators(battleActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatureComponent)
