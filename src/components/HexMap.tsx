import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Sprite } from 'react-pixi-fiber'
import { Point } from 'pixi.js'
import { Hex, each, pointsEqual, getSelectedCreature } from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { terrain } from 'assets/textures'
import { uiActions } from 'store/ui'
import { createHexHandleClick } from './createHexHandleClick'
type Props = StateProps & ActionProps

class MapComponent extends Component<Props> {
  createHandleClick = (hex: Hex) => createHexHandleClick(this.props, hex)

  render() {
    const {
      battle,
      ui: { attackPositions },
    } = this.props
    const { hexes, selected } = battle
    let selectedPosition = new Point(-1)
    const selectedCreature = getSelectedCreature(battle)
    if (selectedCreature && !selected.path) {
      selectedPosition = selectedCreature.position
    }

    return (
      <>
        {each(hexes, (hex, key) => {
          const hasPath = hex.path && hex.path.length > 0
          const isAttackPosition = attackPositions && attackPositions.indexOf(key) >= 0
          const isSelectedPosition = pointsEqual(hex.position, selectedPosition)
          let texture = terrain.grass
          if (hex.occupant === 'stone') {
            texture = terrain.stone
          } else if (isSelectedPosition) {
            if (isAttackPosition) {
              texture = terrain.grassRedDark
            } else {
              texture = terrain.grassDark
            }
          } else if (hex.canBeAttacked || isAttackPosition) {
            texture = terrain.grassRed
          }
          return (
            <Sprite
              interactive
              pointerdown={this.createHandleClick(hex)}
              alpha={hasPath || isAttackPosition ? 0.5 : 1}
              key={key}
              anchor={0.5}
              position={pointToCoordinates(hex.position)}
              texture={texture}
            />
          )
        })}
      </>
    )
  }
}

type StateProps = StoreState
const mapStateToProps = (state: StoreState): StateProps => state

type ActionProps = typeof battleActions & typeof uiActions
const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({ ...battleActions, ...uiActions }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapComponent)
