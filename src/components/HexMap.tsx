import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Sprite } from 'react-pixi-fiber'
import { Point } from 'pixi.js'
import {
  Hex,
  each,
  pointsEqual,
  getCreatures,
  Id,
  getAttackPositions,
} from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { terrain } from 'assets/textures'
import { pointToId } from 'transforms/map/map'
import { uiActions } from 'store/ui'

type Props = StateProps & ActionProps

class MapComponent extends Component<Props> {
  createHandleClick = (hex: Hex) => () => {
    const { moveSelected, battle, highlightAttackTarget } = this.props
    if (!hex.canBeAttacked) {
      highlightAttackTarget([])
    }
    if (hex.canBeAttacked) {
      highlightAttackTarget(getAttackPositions(battle, hex.position))
    } else if (hex.path && hex.path.length > 0) {
      moveSelected(hex.position)
    }
  }

  render() {
    const { battle, ui: { attackPositions } } = this.props
    const { hexes, selected } = battle
    let selectedPosition = new Point(-1)
    if (selected.id && !selected.path) {
      selectedPosition = getCreatures(battle)[selected.id].position
    }

    return (
      <>
        {each(hexes, (hex, key) => {
          const isSelected = hex.path.length > 0
          const texture =
            hex.canBeAttacked || attackPositions.indexOf(key) >= 0
              ? terrain.grassRed
              : pointsEqual(hex.position, selectedPosition)
                ? terrain.grassDark
                : terrain.grass
          return (
            <Sprite
              interactive
              pointerdown={this.createHandleClick(hex)}
              alpha={isSelected ? 0.5 : 1}
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

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent)
