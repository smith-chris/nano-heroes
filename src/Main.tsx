import React, { ReactNode, ReactType } from 'react'
import { stage } from 'app/app'
import { store } from 'store/store'
import { battleActions } from 'store/battle'
import { Point, DisplayObject } from 'pixi.js'
import { render, Text, Container } from 'react-pixi-fiber'
import Game from 'components/Game'
import { Provider } from 'react-redux'
import { getCreatures } from 'transforms/map'
import { sumPoints } from 'transforms/map/point'

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage
)
