import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Sprite } from 'react-pixi-fiber'
import { Point } from 'pixi.js'
import {
  Hex,
  each,
  pointsEqual,
  pointToId,
  getSelectedCreature,
} from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { terrain } from 'assets/textures'
import { uiActions } from 'store/ui'

type Props = StateProps & ActionProps

class MapComponent extends Component<Props> {
  createHandleClick = (hex: Hex) => () => {
    const {
      moveSelected,
      battle,
      highlightTarget,
      resetTarget,
      resetPositions,
      ui: { attackPositions, attackTarget },
    } = this.props
    if (attackPositions.indexOf(pointToId(hex.position)) >= 0) {
      moveSelected(hex.position)
      resetPositions()
      return
    } else if (hex.path && hex.path.length > 0) {
      moveSelected(hex.position)
      resetTarget()
      return
    }
    if (hex.canBeAttacked) {
      highlightTarget({ battle, hex })
      return
    } else if (attackTarget) {
      resetTarget()
    }
  }

  render() {
    const { battle, ui: { attackPositions } } = this.props
    const { hexes, selected } = battle
    let selectedPosition = new Point(-1)
    const selectedCreature = getSelectedCreature(battle)
    if (selectedCreature && !selected.path) {
      selectedPosition = selectedCreature.position
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
