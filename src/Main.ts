import { stage, screen, ticker } from 'app/app'
import { Sprite } from 'pixi.js'
import bunnyImage from 'assets/bunny.png'

// create a new Sprite from an image path
const bunny = Sprite.fromImage(bunnyImage.src)

// center the sprite's anchor point
bunny.anchor.set(0.5)

// move the sprite to the center of the screen
bunny.x = screen.width / 2
bunny.y = screen.height / 2

stage.addChild(bunny)

// Listen for animate update
ticker.add((delta: number) => {
  // just for fun, let's rotate mr rabbit a little
  // delta is 1 if running at 100% performance
  // creates frame-independent transformation
  bunny.rotation += 0.03 * delta
})
