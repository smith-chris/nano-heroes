import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import { Map } from 'transforms/Map'
import { renderMap } from 'entities/Map'

const gameMap = new Map(10, 15)

const map = renderMap(gameMap)

stage.addChild(map)

// ticker.add((delta: number) => {
// })
