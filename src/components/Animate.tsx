import React, { Component, ReactNode } from 'react'
import { Point, ticker } from 'pixi.js'
import { pointToCoordinates } from 'utils/math'
import { calculateStep, roundPoint, pointsEqual } from 'transforms/map'

type Props = {
  render: (position: Point, dirLeft?: boolean) => ReactNode
  onFinish: () => void
  path: Point[]
  speed?: number
  key: number | string
}

type State = {
  position: Point
  dirLeft?: boolean
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
    const setDir = (stepX: number) => {
      if (stepX === 0) { return }
      this.setState({
        dirLeft: stepX < 0,
      })
    }
    setDir(step.x)
    let current = from
    if (current) {
      this.setState({ position: current })
    }

    this.ticker.add(() => {
      if (!current) {
        console.warn('Current is undefined, returning...')
        return
      }
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
        setDir(step.x)
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
    return render(position, this.state.dirLeft)
  }
}
