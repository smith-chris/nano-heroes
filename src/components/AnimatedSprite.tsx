import React, { Component, ReactNode } from 'react'
import { Texture, Point, ticker, Rectangle, BaseTexture } from 'pixi.js'
import { Sprite, SpriteProperties } from 'react-pixi-fiber'
import { pointToCoordinates } from 'utils/math'
import { calculateStep, roundPoint, pointsEqual } from 'transforms/map'
import { Animation } from 'assets/animation'

type Props = SpriteProperties & {
  animation?: Animation
  pointerdown: () => void
}

type State = {
  currentFrame: number
}

export class AnimatedSprite extends Component<Props, State> {
  ticker: ticker.Ticker
  texture: Texture
  componentWillMount() {
    if (this.props.animation) {
      const {
        texture,
        width,
        height,
        framesCount,
        frameGap
      } = this.props.animation
      this.setState({
        currentFrame: 0
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
            currentFrame: frame
          })
        }
      })
      this.ticker.start()
    }
  }
  componentWillUnmount() {
    this.ticker.destroy()
  }
  render() {
    return (
      <Sprite {...this.props} texture={this.texture || this.props.texture} />
    )
  }
}
