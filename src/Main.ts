import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import grassImage from 'assets/grass.png'
import stoneImage from 'assets/stone.png'
import Map, { idToPoint, findPath, pointToId } from 'entities/Map'

const images = {
  grass: grassImage.src,
  stone: stoneImage.src
}

const gameMap = new Map(10, 15)
// create a new Sprite from an image path
const character = Sprite.fromImage(char1.src)

const map = new Container()

map.x = 2
map.y = 2

let start, end
let grassMap = {}
Object.keys(gameMap.hexes).map(key => {
  let val = gameMap.hexes[key]
  let position = idToPoint(key)
  let { x, y } = position
  let src = images[val.type]
  const grass = Sprite.fromImage(src)
  grassMap[key] = grass
  grass.interactive = true
  grass.on('pointerdown', () => {
    start = end
    end = position
    grass.alpha = 0.5
    if (start && end) {
      let path = findPath({
        map: gameMap,
        start,
        end
      })
      Object.values(grassMap).map(g => (g.alpha = 1))
      grassMap[pointToId(start)].alpha = 0.5
      for (let hex of path) {
        grassMap[hex.id].alpha = 0.5
      }
    }
  })
  const isEven = x % 2 === 1
  grass.x = x * 12
  grass.y = y * 8
  if (isEven) {
    grass.y += 4
  }
  map.addChild(grass)
})

// center the sprite's anchor point
character.anchor.set(0.5)

// move the sprite to the center of the screen
character.x = screen.width / 2
character.y = screen.height / 2

stage.addChild(map)
stage.addChild(character)

// ticker.add((delta: number) => {
// })
