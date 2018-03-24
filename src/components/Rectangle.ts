import { CustomPIXIComponent } from 'react-pixi-fiber'
import PIXI, { Graphics } from 'pixi.js'
import { Point } from 'utils/pixi'
import { Bounds, rectsEqual } from 'transforms/map'

type Props = {
  position?: Point
  anchor?: number
  color?: number
  width: number
  height: number
  x?: number
  y?: number
  alpha?: number
}

const applyProps = (graphics: Graphics, { position }: Props) => {
  if (position) {
    graphics.position = position
  }
}

const behavior = {
  customDisplayObject: (props: Props) => {
    const container = new Graphics()
    applyProps(container, props)
    return container
  },
  customApplyProps: (instance: Graphics, prev: Props, next: Props) => {
    applyProps(instance, next)
    if (
      !rectsEqual(prev, next) ||
      prev.color !== next.color ||
      prev.alpha !== next.alpha
    ) {
      const { color, alpha, anchor = 0.5, x, y, width, height } = next
      instance.clear()
      instance.beginFill(color || 0xffffff, alpha)
      instance.drawRect(
        (x || 0) - width * anchor,
        (y || 0) - height * anchor,
        width,
        height,
      )
      instance.endFill()
    }
  },
}
export const Rectangle = CustomPIXIComponent<Props>(behavior, 'Rectangle')
