import React, { Component } from 'react'
import { Texture, ticker, Rectangle } from 'pixi.js'
import { Sprite, SpriteProperties } from 'react-pixi-fiber'
import { Animation } from 'assets/animation'

type Props = SpriteProperties & {
  animation?: Animation
  pointerdown?: () => void
}

type State = {
  currentFrame: number
}

export class AnimatedSprite extends Component<Props, State> {
  ticker: ticker.Ticker
  texture: Texture
  startAnimation = (animation: Animation) => {
    if (this.ticker) {
      this.ticker.stop()
    }
    const { texture, width, height, framesCount, frameGap } = animation
    this.setState({
      currentFrame: 0,
    })
    this.texture = new Texture(texture)
    this.texture.frame = new Rectangle(0, 0, width, height)
    this.ticker = new ticker.Ticker()
    let skipped = 0
    this.ticker.add(() => {
      if (++skipped > frameGap) {
        skipped = 0
        let frame = this.state.currentFrame + 1
        if (frame >= framesCount) {
          frame = 0
        }
        this.texture.frame = new Rectangle(frame * width, 0, width, height)
        this.setState({
          currentFrame: frame,
        })
      }
    })
    this.ticker.start()
  }
  componentWillMount() {
    const { animation } = this.props
    if (animation) {
      this.startAnimation(animation)
    }
  }
  componentWillReceiveProps({ animation }: Props) {
    if (animation && animation !== this.props.animation) {
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
