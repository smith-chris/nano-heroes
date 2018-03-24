import { StatelessComponent } from 'react'
import { Point } from './pixi'

type Props = {
  text: string | number
  color?: number
  anchor: number | Point
}

export const BitmapText: StatelessComponent<Props>
