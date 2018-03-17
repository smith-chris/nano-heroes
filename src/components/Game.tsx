import React from 'react'
import { Container } from 'react-pixi-fiber'
import HexMap from 'components/HexMap'
import CreatureComponent from 'components/Creatures'

export const Game = () => (
  <Container x={16} y={35}>
    <HexMap />
    <CreatureComponent />
  </Container>
)
