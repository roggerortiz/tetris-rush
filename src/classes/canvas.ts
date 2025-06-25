import { BLOCK_FILL_COLOR, BLOCK_SIZE, BLOCK_STRIKE_COLOR, BOARD_HEIGHT, BOARD_WIDTH } from '../helpers/constants'
import { type TPressed } from '../types/pressed'
import { Board } from './board'
import { Piece } from './piece'

export class Canvas {
  private canvas: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | null = null
  private board: Board = new Board()
  private piece: Piece = new Piece()
  gameOver: boolean = false

  getScore() {
    return this.board.score
  }

  create() {
    this.gameOver = false
    this.canvas = document.querySelector('canvas')
    this.context = this.canvas?.getContext('2d') ?? null

    if (this.canvas && this.context) {
      this.canvas.width = BLOCK_SIZE * BOARD_WIDTH
      this.canvas.height = BLOCK_SIZE * BOARD_HEIGHT
      this.context.scale(BLOCK_SIZE, BLOCK_SIZE)
      this.drawBoard()
    }
  }

  drawBoard() {
    this.board.shape.forEach((row, y) => {
      row.forEach(({ value, color }, x) => {
        if (value === 1) {
          this.drawBlock(x, y, color)
        } else {
          this.drawBlock(x, y, BLOCK_FILL_COLOR)
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

  drawBlock(x: number, y: number, color: string) {
    if (!this.context) {
      return
    }

    this.context.lineWidth = 1 / BLOCK_SIZE
    this.context.strokeStyle = BLOCK_STRIKE_COLOR
    this.context.strokeRect(x, y, 1, 1)

    this.context.fillStyle = color
    this.context.fillRect(x, y, 1, 1)
  }

  detectCollisions(piece: Piece) {
    return piece.shape.some((row, y) => {
      return row.some((value, x) => {
        return value === 1 && this.board.shape[y + piece.positionY]?.[x + piece.positionX]?.value !== 0
      })
    })
  }

  updatePiece(pressed: TPressed) {
    const piece = new Piece()
    piece.shape = this.piece.shape
    piece.positionX = this.piece.positionX
    piece.positionY = this.piece.positionY

    if (!pressed.up) {
      piece.move(pressed)
    } else {
      piece.rotate()
    }

    if (!this.detectCollisions(piece)) {
      this.piece.shape = piece.shape
      this.piece.positionX = piece.positionX
      this.piece.positionY = piece.positionY

      return
    }

    if (pressed.down) {
      if (this.detectCollisions(new Piece())) {
        this.board.reset()
        this.gameOver = true
        return
      }

      this.board.solidifyPiece(this.piece)
      this.board.removeRows()
      this.piece.reset()
    }
  }
}
