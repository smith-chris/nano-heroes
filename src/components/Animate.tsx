import React, { Component, ReactNode } from 'react'
import { Point, ticker } from 'pixi.js'
import { pointToCoordinates } from 'utils/math'
import { calculateStep, roundPoint, pointsEqual } from 'transforms/map'

type Props = {
  render: (position: Point) => ReactNode
  onFinish: () => void
  path: Point[]
  speed?: number
  key: number | string
}

type State = {
  position: Point
}

export class Animate extends Component<Props, State> {
  ticker: ticker.Ticker
  componentWillMount() {
    this.ticker = new ticker.Ticker()
    const { path: pointsPath, speed = 1 } = this.props
    const path = pointsPath.map(pointToCoordinates)
    let from = path.shift()
    let to = path.shift()
    let step = calculateStep({
      speed,
      from,
      to,
    })
    let current = from
    this.setState({ position: current })

    this.ticker.add(() => {
      current.x += step.x
      current.y += step.y
      const currentRounded = roundPoint(current)
      this.setState({
        position: currentRounded,
      })
      if (pointsEqual(currentRounded, to)) {
        from = to
        current = from
        to = path.shift()
        if (!to) {
          this.ticker.stop()
          this.props.onFinish()
          return
        }
        step = calculateStep({
          speed,
          from,
          to,
        })
      }
    })
    this.ticker.start()
  }
  componentWillUnmount() {
    this.ticker.destroy()
  }
  render() {
    const { render } = this.props
    const { position } = this.state
    return render(position)
  }
}
