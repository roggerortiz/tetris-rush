import { BOARD_DEFAULT_SCORE } from '../helpers/constants'
import { getEmptyBoard, getEmptyBoardRow } from '../helpers/utils'
import type { TBlock } from '../types/block'
import { Piece } from './piece'

export class Board {
  score: number = 0
  shape: TBlock[][] = []

  constructor() {
    this.reset()
  }

  reset() {
    this.score = 0
    this.shape = getEmptyBoard()
  }

  solidifyPiece(piece: Piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.shape[y + piece.positionY][x + piece.positionX] = { value: 1, color: piece.color }
        }
      })
    })
  }

  removeRows() {
    const rowsToRemove: any[] = []

    this.shape.forEach((row, y) => {
      if (row.every(({ value }) => value === 1)) {
        rowsToRemove.push(y)
      }
    })

    rowsToRemove.forEach((y) => {
      this.shape.splice(y, 1)
      this.shape.unshift(getEmptyBoardRow())
      this.score += BOARD_DEFAULT_SCORE
    })
  }
}
