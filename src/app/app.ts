import { Application, Sprite } from 'pixi.js'
import styles from './app.sass'

const screenSize = 66
const App = new Application(screenSize, screenSize, {
  backgroundColor: 0x000000,
  antialias: false
})
const appElement = document.querySelector('#app')
const canvasHolderElement = appElement.querySelector('div')
const canvasElement = App.view
appElement.classList.add(styles.app)
canvasHolderElement.classList.add(styles.canvasHolder)
canvasElement.classList.add(styles.canvas)
canvasHolderElement.appendChild(App.view)

const resize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const smaller = Math.min(width, height)
  canvasHolderElement.style.width = `${smaller}px`
  canvasHolderElement.style.height = `${smaller}px`
}
resize()

window.addEventListener('resize', resize)

export const stage = App.stage
export const ticker = App.ticker
export const screen = App.screen

export default App
