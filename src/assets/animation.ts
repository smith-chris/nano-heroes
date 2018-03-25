import { BaseTexture } from 'pixi.js'
import { Point } from 'utils/pixi'
import knightWalk from 'assets/knight/walk.png'
import knightIdle from 'assets/knight/idle.png'
import knightAttack from 'assets/knight/attack.png'
import knightDefend from 'assets/knight/defend.png'
import skeletonWalk from 'assets/skeleton/walk.png'
import skeletonIdle from 'assets/skeleton/idle.png'
import skeletonAttack from 'assets/skeleton/attack.png'
import skeletonDefend from 'assets/skeleton/defend.png'

export const createAnimation = (
  { src, width, height }: typeof knightWalk,
  framesCount: number,
  frameGap: number = 6,
  offset?: Point,
) => {
  return {
    texture: BaseTexture.from(src),
    framesCount,
    width: width / framesCount,
    height,
    frameGap,
    offset,
  }
}

export type Animation = ReturnType<typeof createAnimation>

const knightOfset = new Point(0, 4)
export const KnightAnimation = {
  walk: createAnimation(knightWalk, 8, 6, knightOfset),
  idle: createAnimation(knightIdle, 4, 21, knightOfset),
  attack: createAnimation(knightAttack, 10, 6, new Point(19, 3)),
  defend: createAnimation(knightDefend, 7, 5, knightOfset),
}

const skeletonOfset = new Point(5, 0)
export const SkeletonAnimation = {
  walk: createAnimation(skeletonWalk, 13, 3, skeletonOfset),
  idle: createAnimation(skeletonIdle, 11, 10, skeletonOfset),
  attack: createAnimation(skeletonAttack, 18, 4, new Point(11, 0)),
  defend: createAnimation(skeletonDefend, 8, 6, new Point(2, 0)),
}
