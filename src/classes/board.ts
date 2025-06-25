import { BOARD_DEFAULT_SCORE, BOARD_HEIGHT, BOARD_WIDTH } from '../helpers/constants'
import type { Block } from '../types/block'

export class Board {
  shape: Block[][] = []
  score: number = 0

  constructor() {
    this.shape = Array(BOARD_HEIGHT)
      .fill([])
      .map(() => Array(BOARD_WIDTH).fill({ value: 0 }))
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
      this.shape.unshift(Array(BOARD_WIDTH).fill(0))
      this.score += BOARD_DEFAULT_SCORE
    })
  }
}
