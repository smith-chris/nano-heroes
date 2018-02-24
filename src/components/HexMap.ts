import { Sprite, Container } from 'pixi.js'
import { idToPoint, Hexes, pointToId } from 'transforms/map'
import { pointToCoordinates } from 'utils'
import grassImage from 'assets/grass.png'
import stoneImage from 'assets/stone.png'
import { subscribe, store } from 'store/store'
import { SpriteMap } from 'utils/pixi'

const images = {
  grass: grassImage.src,
  stone: stoneImage.src
}

export const HexMap = (hexes: Hexes) => {
  const result = new Container()
  const spriteMap: SpriteMap = {}
  Object.keys(hexes).map(key => {
    let val = hexes[key]
    let position = idToPoint(key)
    let src = images[val.type]
    const hexSprite = Sprite.fromImage(src)
    hexSprite.anchor.set(0.5)
    Object.assign(hexSprite.position, pointToCoordinates(position))
    result.addChild(hexSprite)
    spriteMap[key] = hexSprite
  })
  subscribe<Hexes>(
    s => s.battle.hexes,
    newHexes => {
      for (const key in newHexes) {
        const hex = newHexes[key]
        const sprite = spriteMap[key]
        if (hex.path.length > 0) {
          sprite.alpha = 0.5
        } else {
          sprite.alpha = 1
        }
      }
      const { selectedHex } = store.getState().battle
      if (selectedHex) {
        spriteMap[pointToId(selectedHex.position)].alpha = 0.5
      }
    }
  )
  return result
}
