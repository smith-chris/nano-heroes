import { BaseTexture, Texture, Rectangle } from 'pixi.js'
import { Point } from 'utils/pixi'
import knightWalk from 'assets/knight/walk.png'
import knightIdle from 'assets/knight/idle.png'
import knightAttack from 'assets/knight/attack.png'
import knightDefend from 'assets/knight/defend.png'
import knightDeath from 'assets/knight/death.png'
import skeletonWalk from 'assets/skeleton/walk.png'
import skeletonIdle from 'assets/skeleton/idle.png'
import skeletonAttack from 'assets/skeleton/attack.png'
import skeletonDefend from 'assets/skeleton/defend.png'
import skeletonDeath from 'assets/skeleton/death.png'

const defaultOptions = {
  loop: true,
  delay: 0,
  endReversed: false,
}

const optional = <T extends object>(o: T) => o as { [K in keyof T]?: T[K] }

export const createAnimation = (
  { src, width, height }: typeof knightWalk,
  { count = 0, gap = 6 },
  offset?: Point,
  options = optional(defaultOptions),
) => {
  const singleFrameWidth = width / count
  const texture = BaseTexture.from(src)
  let _lastFrameTexture: Texture
  const result = {
    texture,
    framesCount: count,
    width: singleFrameWidth,
    totalWidth: width,
    height,
    frameGap: gap,
    offset,
    options: { ...defaultOptions, ...options },
    getLastFrameTexture: () => {
      if (!_lastFrameTexture) {
        _lastFrameTexture = new Texture(texture)
        _lastFrameTexture.frame = new Rectangle(0, 0, width, height)
      }
      return _lastFrameTexture
    },
  }
  return result
}

export type Animation = ReturnType<typeof createAnimation>

const knightOfset = new Point(0, 4)
export const KnightAnimation = {
  walk: createAnimation(knightWalk, { count: 8, gap: 6 }, knightOfset),
  idle: createAnimation(knightIdle, { count: 4, gap: 21 }, knightOfset),
  attack: createAnimation(knightAttack, { count: 10, gap: 6 }, new Point(19, 3), {
    loop: false,
  }),
  defend: createAnimation(knightDefend, { count: 7, gap: 6 }, knightOfset, {
    loop: false,
    endReversed: true,
  }),
  death: createAnimation(knightDeath, { count: 9, gap: 6 }, knightOfset, {
    loop: false,
    delay: 33,
  }),
}

const skeletonOfset = new Point(5, 0)
export const SkeletonAnimation = {
  walk: createAnimation(skeletonWalk, { count: 13, gap: 3 }, skeletonOfset),
  idle: createAnimation(skeletonIdle, { count: 11, gap: 10 }, skeletonOfset),
  attack: createAnimation(skeletonAttack, { count: 18, gap: 4 }, new Point(11, 0), {
    loop: false,
  }),
  defend: createAnimation(skeletonDefend, { count: 8, gap: 6 }, new Point(2, 0), {
    loop: false,
    delay: 27,
  }),
  death: createAnimation(skeletonDeath, { count: 16, gap: 4 }, new Point(-2, 0), {
    loop: false,
    delay: 36,
  }),
}
