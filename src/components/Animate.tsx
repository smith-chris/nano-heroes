import React, { Component, ReactNode } from 'react'
import { Point, ticker } from 'pixi.js'
import { pointToCoordinates } from 'utils/math'

type Props = {
  render: (position: Point) => ReactNode
  onFinish: () => void
  path: Point[]
  key: number | string
}

type State = {
  position: Point
}

export class Animate extends Component<Props, State> {
  ticker: ticker.Ticker
  componentWillMount() {
    this.ticker = new ticker.Ticker()
    const { path } = this.props
    const fromPoint = path[0]
    const from = pointToCoordinates(fromPoint)
    this.setState({
      position: from
    })
    const toPoint = path[path.length - 1]
    const to = pointToCoordinates(toPoint)
    const width = to.x - from.x
    const height = to.y - from.y
    let progress = 0
    const end = 60
    this.ticker.add(() => {
      if (++progress > end) {
        this.ticker.stop()
        this.props.onFinish()
        return
      }
      this.setState({
        position: new Point(
          Math.round(from.x + width * (progress / end)),
          Math.round(from.y + height * (progress / end))
        )
      })
    })
    this.ticker.start()
  }
  componentWillUnmount() {
    this.ticker.destroy()
  }
  render() {
    const { render } = this.props
    const { position } = this.state
    return <>{render(position)}</>
  }
}
