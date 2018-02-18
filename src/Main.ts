import { stage, screen, ticker } from 'app/app'
import { Sprite, Container } from 'pixi.js'
import char1 from 'assets/char1.png'
import grassImage from 'assets/grass.png'
import Map from 'entities/Map'

const myMap = new Map(4, 4)
// create a new Sprite from an image path
const character = Sprite.fromImage(char1.src)

const map = new Container()

map.x = 2
map.y = 2

for (let x = 0; x < 5; x++) {
  for (let y = 0; y < 30; y++) {
    const grass = Sprite.fromImage(grassImage.src)
    const isOdd = y % 2 === 1
    grass.x = x * 24
    if (isOdd) {
      grass.x += 12
    }
    grass.y = y * 4
    map.addChild(grass)
  }
}

// center the sprite's anchor point
character.anchor.set(0.5)

// move the sprite to the center of the screen
character.x = screen.width / 2
character.y = screen.height / 2

stage.addChild(map)
stage.addChild(character)

// Listen for animate update
ticker.add((delta: number) => {
  // just for fun, let's rotate mr rabbit a little
  // delta is 1 if running at 100% performance
  // creates frame-independent transformation
})
