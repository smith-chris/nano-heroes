import React from 'react'
import { Text } from 'react-pixi-fiber'

export const BitmapText = ({ color, ...rest }) => {
  const style = {
    fontFamily: 'Pico',
    fontSize: 4,
    fill: color || 0x000000,
    lineHeight: 6,
  }
  return <Text style={style} {...rest} />
}
