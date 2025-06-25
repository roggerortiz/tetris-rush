import { BLOCK_SIZE, BOARD_FILL_COLOR, BOARD_HEIGHT, BOARD_STRIKE_COLOR, BOARD_WIDTH } from '../helpers/constants'
import { type TPressed } from '../types/pressed'
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
      this.updatePiece({ down: true })
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

  detectCollisions() {
    return this.piece.shape.some((row, y) => {
      return row.some((value, x) => {
        return value === 1 && this.board.shape[y + this.piece.positionY]?.[x + this.piece.positionX]?.value !== 0
      })
    })
  }

  updatePiece (pressed: TPressed) {
    if (pressed.left) {
      this.piece.positionX--
      if (this.detectCollisions()) {
        this.piece.positionX++
      }
    }

    if (pressed.right) {
      this.piece.positionX++
      if (this.detectCollisions()) {
        this.piece.positionX--
      }
    }

    if (pressed.down) {
      this.piece.positionY++
      if (this.detectCollisions()) {
        this.piece.positionY--

        this.board.solidifyPiece(this.piece)
        this.board.removeRows()
        this.piece.reset()

        if (this.detectCollisions()) {
          this.board.reset()
        }
      }
    }

    if (pressed.up) {
      const prevShape: number[][] = this.piece.shape
      this.piece.rotate()
      if (this.detectCollisions()) {
        this.piece.shape = prevShape
      }
    }
  }
}
