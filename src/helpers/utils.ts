import { BOARD_WIDTH } from './constants'
import { COLORS, PIECES } from './data'

export const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * COLORS.length)
  return COLORS[randomIndex]
}

export const getRandomShape = (): number[][] => {
  return PIECES[Math.floor(Math.random() * PIECES.length)]
}

export const getPiecePositionX = (size: number): number => {
  return Math.floor((BOARD_WIDTH - size) / 2)
}
