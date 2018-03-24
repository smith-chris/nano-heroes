import { CustomPIXIComponent } from 'react-pixi-fiber'
import { Container } from 'pixi.js'
import { Point } from 'utils/pixi'

type Props = {
  position?: Point
}

const applyProps = (container: Container, props: Props) => {
  if (props.position) {
    container.position = props.position
  }
}

// Always render children ordered by their position.y
const TYPE = 'OrderedContainer'
const behavior = {
  customDisplayObject: (props: Props) => {
    const container = new Container()
    applyProps(container, props)
    return container
  },
  customApplyProps: (instance: Container, oldProps: Props, newProps: Props) => {
    applyProps(instance, newProps)
    instance.children.sort((a, b) => (a.position.y > b.position.y ? 1 : -1))
  },
}

export const OrderedContainer = CustomPIXIComponent<Props>(behavior, TYPE)
