import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Sprite } from 'react-pixi-fiber'
import { Point } from 'pixi.js'
import { Hex, each, pointsEqual, getCreatures, Id } from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { terrain } from 'assets/textures'
import { getNeighbouringHexes } from 'transforms/map/path'
import { pointToId } from 'transforms/map/map'

type Props = StateProps & ActionProps

type State = {
  selectAttackTargetHexes: Id[]
}

class MapComponent extends Component<Props, State> {
  state = {
    selectAttackTargetHexes: [],
  }

  createHandleClick = (hex: Hex) => () => {
    const { moveSelected, battle } = this.props
    if (!hex.canBeAttacked) {
      this.setState({
        selectAttackTargetHexes: [],
      })
    }
    if (hex.canBeAttacked) {
      this.setState({
        selectAttackTargetHexes: getNeighbouringHexes(battle, hex.position)
          .filter(elem => elem.path && elem.path.length > 1)
          .map(elem => pointToId(elem.position)),
      })
    } else if (hex.path && hex.path.length > 0) {
      moveSelected(hex.position)
      this.setState({
        selectAttackTargetHexes: [],
      })
    }
  }

  render() {
    const { battle } = this.props
    const { hexes, selected } = battle
    const { selectAttackTargetHexes } = this.state
    let selectedPosition = new Point(-1)
    if (selected.id && !selected.path) {
      selectedPosition = getCreatures(battle)[selected.id].position
    }

    return (
      <>
        {each(hexes, (hex, key) => {
          const isSelected = hex.path.length > 0
          const texture =
            hex.canBeAttacked || selectAttackTargetHexes.indexOf(key) >= 0
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

type ActionProps = typeof battleActions
const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators(battleActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent)
