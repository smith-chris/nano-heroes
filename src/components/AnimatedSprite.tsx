import React, { Component } from 'react'
import { Texture, ticker, Rectangle } from 'pixi.js'
import { Sprite, SpriteProperties } from 'react-pixi-fiber'
import { Animation } from 'assets/animation'

type Props = SpriteProperties & {
  animation?: Animation
  pointerdown?: () => void
  onFinish?: () => void
}

type State = {
  currentFrame: number
}

export class AnimatedSprite extends Component<Props, State> {
  ticker: ticker.Ticker
  tickerCallback: () => void
  texture: Texture
  startAnimation = (animation: Animation, { onFinish }: Props) => {
    const {
      texture,
      width,
      height,
      framesCount,
      frameGap,
      options: { loop, delay, endReversed },
    } = animation
    this.setState({
      currentFrame: -1,
    })
    this.texture = new Texture(texture)
    this.texture.frame = new Rectangle(0, 0, width, height)
    let skipped = 0
    let currentDelay = delay
    let direction = 1
    this.tickerCallback = () => {
      if (++skipped > frameGap) {
        if (--currentDelay > 0) {
          return
        }
        skipped = 0
        let frame = this.state.currentFrame + direction
        if (direction > 0 && frame >= framesCount - 1) {
          if (endReversed) {
            direction = -1
          } else if (!loop) {
            this.ticker.remove(this.tickerCallback)
            if (onFinish) {
              onFinish()
            }
            return
          }
          if (!endReversed) {
            currentDelay = delay
            frame = 0
          }
        } else if (direction < 0 && endReversed && frame <= 0) {
          if (!loop) {
            this.ticker.remove(this.tickerCallback)
            if (onFinish) {
              onFinish()
            }
            return
          }
          currentDelay = delay
          frame = 0
          direction = 1
        }

        this.texture.frame = new Rectangle(frame * width, 0, width, height)
        this.setState({
          currentFrame: frame,
        })
      }
    }
    this.ticker.add(this.tickerCallback)
  }
  componentWillMount() {
    const { animation } = this.props
    this.ticker = new ticker.Ticker()
    if (animation) {
      this.startAnimation(animation, this.props)
      this.ticker.start()
    }
  }
  componentWillReceiveProps(newProps: Props) {
    const { animation } = newProps
    if (animation && animation !== this.props.animation) {
      this.ticker.remove(this.tickerCallback)
      this.startAnimation(animation, newProps)
    }
  }
  componentWillUnmount() {
    this.ticker.destroy()
  }
  render() {
    return <Sprite {...this.props} texture={this.texture || this.props.texture} />
  }
}
