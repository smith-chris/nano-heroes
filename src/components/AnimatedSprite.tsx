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
  startAnimation = (animation: Animation) => {
    const {
      texture,
      width,
      totalWidth,
      height,
      framesCount,
      frameGap,
      options: { loop },
    } = animation
    const { onFinish } = this.props
    this.setState({
      currentFrame: 0,
    })
    this.texture = new Texture(texture)
    this.texture.frame = new Rectangle(0, 0, width, height)
    let skipped = 0
    this.tickerCallback = () => {
      if (++skipped > frameGap) {
        skipped = 0
        let frame = this.state.currentFrame + 1
        if (frame >= framesCount) {
          if (!loop) {
            this.ticker.remove(this.tickerCallback)
            if (onFinish) {
              onFinish()
            }
            return
          }
          frame = 0
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
      this.startAnimation(animation)
      this.ticker.start()
    }
  }
  componentWillReceiveProps({ animation }: Props) {
    if (animation && animation !== this.props.animation) {
      this.ticker.remove(this.tickerCallback)
      this.startAnimation(animation)
    }
  }
  componentWillUnmount() {
    this.ticker.destroy()
  }
  render() {
    return <Sprite {...this.props} texture={this.texture || this.props.texture} />
  }
}
