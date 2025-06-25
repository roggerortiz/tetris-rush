import { getCenterPosition, getRandomColor, getRandomShape } from '../helpers/utils'

export class Piece {
  color: string = ''
  shape: number[][] = []
  positionX: number = 0
  positionY: number = 0

  constructor() {
    this.reset()
  }

  reset() {
    this.color = getRandomColor()
    this.shape = getRandomShape()
    this.positionX = getCenterPosition(this.shape[0].length)
    this.positionY = 0
  }

  rotate() {
    const rotatedShape: number[][] = []

    for (let i = 0; i < this.shape[0].length; i++) {
      const row: number[] = []

      for (let j = this.shape.length - 1; j >= 0; j--) {
        row.push(this.shape[j][i])
      }

      rotatedShape.push(row)
    }

    this.shape = rotatedShape
  }
}
