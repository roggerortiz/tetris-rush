import { BOARD_HEIGHT, BOARD_WIDTH } from './constants'
import { COLORS, PIECES } from './data'

export const getEmptyBoard = () => {
  return Array(BOARD_HEIGHT)
    .fill([])
    .map(() => getEmptyBoardRow())
}

export const getEmptyBoardRow = () => {
  return Array(BOARD_WIDTH).fill({ value: 0, color: '' })
}

export const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * COLORS.length)
  return COLORS[randomIndex]
}

export const getRandomShape = (): number[][] => {
  return PIECES[Math.floor(Math.random() * PIECES.length)]
}

export const getCenterPosition = (size: number): number => {
  return Math.floor((BOARD_WIDTH - size) / 2)
}
