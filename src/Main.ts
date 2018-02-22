import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import Map, { idToPoint, findPath, pointToId } from 'entities/Map'
import renderHexes from 'renderers/hexes'

const gameMap = new Map(10, 15)
// create a new Sprite from an image path
const character = Sprite.fromImage(char1.src)

const map = renderHexes(gameMap.hexes)

map.x = 2
map.y = 2

// center the sprite's anchor point
character.anchor.set(0.5)

// move the sprite to the center of the screen
character.x = screen.width / 2
character.y = screen.height / 2

stage.addChild(map)
stage.addChild(character)

// ticker.add((delta: number) => {
// })
