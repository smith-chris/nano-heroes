import React, { Component, ReactNode } from 'react'
import { Container } from 'react-pixi-fiber'
import HexMap from 'components/HexMap'
import Creatures from 'components/Creatures'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { battleActions } from 'store/battle'
import { Creature } from 'transforms/creature'
import { Point } from 'utils/pixi'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(battleActions, dispatch)
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
    } = this.props
    loadMap({ width: 9, height: 10 })
    addAttackers([2, 5, 8].map(y => new Creature(new Point(0, y))))
    addDefenders([2, 5, 8].map(y => new Creature(new Point(8, y))))
    initialRound()
    selectNextCreature()
    setTimeout(() => {
      moveSelected(new Point(4, 5))
    }, 500)
  }
  render() {
    return (
      <Container x={16} y={35}>
        <HexMap />
        <Creatures />
      </Container>
    ) as ReactNode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
