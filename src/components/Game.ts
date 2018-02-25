import { Container } from 'pixi.js'
import { store } from 'store/store'
import { HexMap } from 'components/HexMap'
import { Creatures } from 'components/Creatures'

export const Game = () => {
  const { battle } = store.getState()
  const result = new Container()
  result.x = 1 + 8
  result.y = 3 + 4

  const hexes = HexMap(battle.hexes)
  result.addChild(hexes)

  result.addChild(Creatures(battle.hexes))

  return result
}
