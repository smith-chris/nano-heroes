import React from 'react'
import { Text } from 'react-pixi-fiber'

export const BitmapText = ({ text, color }) => {
  const style = {
    fontFamily: 'Pico',
    fontSize: 4,
    fill: color || 0x000000,
    lineHeight: 6,
  }
  return <Text style={style} text={text} />
}
