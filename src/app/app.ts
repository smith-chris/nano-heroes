import { Application } from 'pixi.js'
import styles from './app.sass'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const screenSize = 128
const App = new Application(screenSize, screenSize, {
  backgroundColor: 0x124234,
  antialias: false,
  roundPixels: true,
})
const appElement = document.querySelector('#app')
const canvasHolderElement = appElement && appElement.querySelector('div')
if (!appElement) {
  console.warn('App element not found..')
} else if (!canvasHolderElement) {
  console.warn('Canvas not found..')
} else {
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
}

export const stage = App.stage
export const ticker = App.ticker
