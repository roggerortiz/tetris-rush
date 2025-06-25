import { getPiecePositionX, getRandomColor, getRandomShape } from '../helpers/utils'

export class Piece {
  color: string = ''
  shape: number[][] = []
  positionX: number = 0
  positionY: number = 0
  directionX: number = 0
  directionY: number = 0

  constructor() {
    this.reset()
  }

  reset() {
    this.color = getRandomColor()
    this.shape = getRandomShape()
    this.positionX = getPiecePositionX(this.shape[0].length)
    this.positionY = 0
  }

  move() {
    this.positionX += this.directionX
    this.positionY += this.directionY
  }
}
