import React from 'react'
import { Container } from 'react-pixi-fiber'
import HexMap from 'components/MapComponent'
import CreatureComponent from 'components/CreatureComponent'

export const Game = () => (
  <Container x={9} y={7}>
    <HexMap />
    <CreatureComponent />
  </Container>
)
