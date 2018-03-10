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

type Props = StateProps & ActionProps

class CreatureComponent extends Component<Props> {
  getPosition(creature: Creature) {
    const position = pointToCoordinates(creature.position)
    position.y += 1
    return position
  }

  createHandleClick = (id: Id) => () => {
    const { selectCreature } = this.props
    selectCreature(id)
  }

  createRenderCreature = (key: string) => (position: Point) => (
    <Sprite
      interactive
      key={key}
      pointerdown={this.createHandleClick(key)}
      anchor={new Point(0.5, 1)}
      position={position}
      texture={Texture.fromImage(char1.src)}
    />
  )

  handleAnimationFinish = () => {
    this.props.moveSelectedEnd()
  }

  render() {
    const { battle: { selected, attackers, defenders } } = this.props
    const animateSelected = selected.path && selected.path.length > 0

    return (
      <OrderedContainer>
        {each([attackers, defenders], (creature, key) => {
          const renderCreature = this.createRenderCreature(key)
          if (creature.id === selected.id && animateSelected) {
            return (
              <Animate
                key={key}
                speed={0.7}
                path={selected.path}
                render={renderCreature}
                onFinish={this.handleAnimationFinish}
              />
            )
          } else {
            return renderCreature(this.getPosition(creature))
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
