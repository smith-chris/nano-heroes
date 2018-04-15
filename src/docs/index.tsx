import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Docs } from './Docs'

let rootElement = document.getElementById('app')
const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Docs />
    </AppContainer>,
    rootElement,
  )
}

render()

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Docs', () => {
    render()
  })
}
