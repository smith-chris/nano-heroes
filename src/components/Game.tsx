import React, { Component, ReactNode } from 'react'
import { Container } from 'react-pixi-fiber'
import HexMap from 'components/HexMap'
import Creatures from 'components/Creatures'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { uiActions } from 'store/ui'
import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'
import { getHex } from 'transforms/map/map'
import { store } from 'store/store'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...battleActions, ...uiActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Game extends Component<Props> {
  componentWillMount() {
    const {
      loadMap,
      addAttackers,
      addDefenders,
      initialRound,
      selectNextCreature,
      battle,
      moveSelected,
      changeTurn,
      highlightTarget,
      resetPositions,
    } = this.props
    loadMap({ width: 10, height: 5 })
    addAttackers([1, 4].map(y => new Creature(new Point(0, y))))
    addDefenders([1, 4].map(y => new Creature(new Point(9, y))))
    initialRound()
    selectNextCreature()
    setTimeout(() => {
      moveSelected(new Point(5, 2))
    }, 500)
    setTimeout(() => {
      const state = store.getState()
      const hex = getHex(state.battle.hexes, new Point(5, 2))
      highlightTarget({ battle: state.battle, hex })
    }, 1500)
    setTimeout(() => {
      moveSelected(new Point(4, 3))
      resetPositions()
    }, 2000)
  }
  render() {
    return (
      <Container x={14} y={35}>
        <HexMap />
        <Creatures />
      </Container>
    ) as ReactNode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
