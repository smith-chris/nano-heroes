import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Sprite } from 'react-pixi-fiber'
import { Texture, Point } from 'pixi.js'
import grassImage from 'assets/grass.png'
import stoneImage from 'assets/stone.png'
import { HashMap, Hex, each, pointsEqual, getCreatures } from 'transforms/map'
import { pointToCoordinates } from 'utils/math'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'

const images: HashMap<string> = {
  grass: grassImage.src,
  stone: stoneImage.src
}

type Props = StateProps & ActionProps

class MapComponent extends Component<Props> {
  createHandleClick = (hex: Hex) => () => {
    const { moveSelected } = this.props
    if (hex.path && hex.path.length > 0) {
      moveSelected(hex.position)
    }
  }

  render() {
    const { battle } = this.props
    const { hexes, selected } = battle
    let selectedPosition = new Point(-1)
    if (selected.id && !selected.path) {
      selectedPosition = getCreatures(battle)[selected.id].position
    }

    return (
      <>
        {each(hexes, (hex, key) => {
          const isSelected =
            hex.path.length > 0 || pointsEqual(hex.position, selectedPosition)
          return (
            <Sprite
              interactive
              pointerdown={this.createHandleClick(hex)}
              alpha={isSelected ? 0.5 : 1}
              key={key}
              anchor={0.5}
              position={pointToCoordinates(hex.position)}
              texture={Texture.fromImage(images.grass)}
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
