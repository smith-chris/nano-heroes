import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { renderMap } from 'entities/Map'
import { Store } from './Store'

const store = new Store()

const map = renderMap(store)

stage.addChild(map)

// ticker.add((delta: number) => {
// })
