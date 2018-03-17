import { Rectangle, BaseTexture } from 'pixi.js'
import walk from 'assets/knight/walk.png'
import idle from 'assets/knight/idle.png'
import { Point } from 'utils/pixi'

export const createAnimation = (
  { src, width, height }: typeof walk,
  framesCount: number,
  frameGap: number,
  offset?: Point
) => {
  return {
    texture: BaseTexture.from(src),
    framesCount,
    width: width / framesCount,
    height,
    frameGap,
    offset
  }
}

export type Animation = ReturnType<typeof createAnimation>

const knightOfset = new Point(0, 4)
export const KnightAnimation = {
  walk: createAnimation(walk, 8, 6, knightOfset),
  idle: createAnimation(idle, 4, 21, knightOfset)
}
