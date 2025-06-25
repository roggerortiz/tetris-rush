import { BLOCK_SIZE, BOARD_FILL_COLOR, BOARD_HEIGHT, BOARD_STRIKE_COLOR, BOARD_WIDTH } from '../helpers/constants'
import { defaultPressed, type Pressed } from '../types/pressed'
import { Board } from './board'
import { Piece } from './piece'

export class Canvas {
  private canvas: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | null = null
  private board: Board = new Board()
  private piece: Piece = new Piece()
  private dropTime: number = 0
  private lastTime: number = 0

  constructor() {
    this.canvas = document.querySelector('canvas')
    this.context = this.canvas?.getContext('2d') ?? null

    if (this.canvas && this.context) {
      this.canvas.width = BLOCK_SIZE * BOARD_WIDTH
      this.canvas.height = BLOCK_SIZE * BOARD_HEIGHT
      this.context.scale(BLOCK_SIZE, BLOCK_SIZE)
    }
  }

  draw(time: number) {
    this.autoDrop(time)
    this.drawBoard()
    this.drawPiece()
  }

  autoDrop(time: number) {
    const deltaTime: number = time - this.lastTime

    this.lastTime = time
    this.dropTime += deltaTime

    if (this.dropTime > 1000) {
      this.movePiece({ ...defaultPressed, down: true })
      this.dropTime = 0
    }
  }

  drawBoard() {
    this.board.shape.forEach((row, y) => {
      row.forEach(({ value, color }, x) => {
        if (value === 1) {
          this.drawBlock(x, y, color)
        } else {
          this.drawBlock(x, y)
        }
      })
    })
  }

  drawPiece() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.drawBlock(x + this.piece.positionX, y + this.piece.positionY, this.piece.color)
        }
      })
    })
  }

  drawBlock(positionX: number, positionY: number, color?: string) {
    if (!this.context) {
      return
    }

    this.context.lineWidth = 1 / BLOCK_SIZE
    this.context.strokeStyle = BOARD_STRIKE_COLOR
    this.context.strokeRect(positionX, positionY, 1, 1)

    this.context.fillStyle = color || BOARD_FILL_COLOR
    this.context.fillRect(positionX, positionY, 1, 1)
  }

  detectCollisions(pressed: Pressed) {
    let directionX: number = pressed.left ? -1 : pressed.right ? 1 : 0
    let directionY: number = pressed.up ? -1 : pressed.down ? 1 : 0
    let positionX: number = this.piece.positionX + directionX
    let positionY: number = this.piece.positionY + directionY

    const collided: boolean = this.piece.shape.some((row, y) => {
      return row.some((value, x) => {
        return value === 1 && this.board.shape[y + positionY]?.[x + positionX]?.value !== 0
      })
    })

    if (!collided) {
      this.piece.directionX = directionX
      this.piece.directionY = directionY
    }

    return collided
  }

  movePiece(pressed: Pressed) {
    if (!this.detectCollisions(pressed)) {
      this.piece.move()
    } else if (pressed.down) {
      this.solidifyPiece()
    }
  }

  solidifyPiece() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.board.shape[y + this.piece.positionY][x + this.piece.positionX] = { value: 1, color: this.piece.color }
        }
      })
    })
    this.piece.reset()
    this.board.removeRows()
  }
}
