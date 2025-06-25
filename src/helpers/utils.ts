import type { Block } from '../types/block'
import type { Piece } from '../types/piece'
import { BOARD_HEIGHT, BOARD_WIDTH } from './constants'
import { COLORS, PIECES } from './data'

export const getEmptyBoard = (): Block[][] => {
  return Array(BOARD_HEIGHT)
    .fill([])
    .map(() => getEmptyBoardRow())
}

export const getEmptyBoardRow = (): Block[] => {
  return Array(BOARD_WIDTH).fill({ value: 0, color: '' })
}

export const getNewPiece = (): Piece => {
  const color: string = getRandomColor()
  const shape: number[][] = getRandomShape()
  const positionX: number = getCenterPosition(shape[0].length)
  const positionY: number = 0

  return { color, shape, positionX, positionY }
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
