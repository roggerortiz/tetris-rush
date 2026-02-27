<script lang="ts">
  import { onMount } from 'svelte'
  import {
    BLOCK_FILL_COLOR,
    BLOCK_SIZE,
    BLOCK_STRIKE_COLOR,
    BOARD_HEIGHT,
    BOARD_SCORE,
    BOARD_WIDTH
  } from './helpers/constants'
  import { EventKey } from './helpers/enums'
  import { getEmptyBoard, getEmptyBoardRow, getNewPiece } from './helpers/utils'
  import Pause from './icons/pause.svelte'
  import Play from './icons/play.svelte'
  import ResetLarge from './icons/reset-large.svelte'
  import ResetSmall from './icons/reset-small.svelte'
  import type { Block } from './types/block'
  import type { Piece } from './types/piece'
  import type { Pressed } from './types/pressed'

  let canvas: HTMLCanvasElement | null = $state<HTMLCanvasElement | null>(null)
  let context: CanvasRenderingContext2D | null = $state<CanvasRenderingContext2D | null>(null)
  let board: Block[][] = $state<Block[][]>(getEmptyBoard())
  let tempPiece: Piece | null = $state<Piece | null>(null)
  let piece: Piece | null = $state<Piece | null>(null)
  let playing: boolean = $state<boolean>(false)
  let gameOver: boolean = $state<boolean>(false)
  let score: number = $state<number>(0)
  let dropTime: number = $state<number>(0)
  let lastTime: number = $state<number>(0)

  onMount(() => {
    canvas = document.querySelector('canvas')
    context = canvas?.getContext('2d') ?? null

    if (canvas && context) {
      canvas.width = BLOCK_SIZE * BOARD_WIDTH
      canvas.height = BLOCK_SIZE * BOARD_HEIGHT
      context.scale(BLOCK_SIZE, BLOCK_SIZE)
      drawBoard()
    }
  })

  const onKeyDown = ({ key }: KeyboardEvent) => {
    if (key === EventKey.SPACE) {
      togglePlay()
      return
    }

    updatePiece({
      up: key === EventKey.UP,
      down: key === EventKey.DOWN,
      left: key === EventKey.LEFT,
      right: key === EventKey.RIGHT
    })
  }

  const togglePlay = () => {
    playing = !playing

    if (!piece) {
      piece = getNewPiece()
    }

    if (playing) {
      playingGame()
    }
  }

  const playingGame = (time: number = 0) => {
    if (!playing || gameOver) {
      return
    }

    autoDrop(time)
    drawBoard()
    drawPiece()

    window.requestAnimationFrame(playingGame)
  }

  const autoDrop = (time: number) => {
    const deltaTime: number = time - lastTime

    lastTime = time
    dropTime += deltaTime

    if (dropTime > 750) {
      updatePiece({ down: true })
      dropTime = 0
    }
  }

  const drawBoard = () => {
    board.forEach((row, y) => {
      row.forEach(({ value, color }, x) => {
        if (value === 1) {
          drawBlock(x, y, color)
        } else {
          drawBlock(x, y, BLOCK_FILL_COLOR)
        }
      })
    })
  }

  const drawPiece = () => {
    if (!piece) {
      return
    }

    const color: string = piece.color
    const positionX: number = piece.positionX
    const positionY: number = piece.positionY

    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1 && piece) {
          drawBlock(x + positionX, y + positionY, color)
        }
      })
    })
  }

  const drawBlock = (x: number, y: number, color: string) => {
    if (!context) {
      return
    }

    context.lineWidth = 1 / BLOCK_SIZE
    context.strokeStyle = BLOCK_STRIKE_COLOR
    context.strokeRect(x, y, 1, 1)

    context.fillStyle = color
    context.fillRect(x, y, 1, 1)
  }

  const updatePiece = (pressed: Pressed) => {
    if (!piece) {
      return
    }

    tempPiece = { ...piece }

    if (!pressed.up) {
      tempPiece = movePiece(tempPiece, pressed)
    } else {
      tempPiece = rotatePiece(tempPiece)
    }

    if (!detectCollisions(tempPiece)) {
      piece = { ...tempPiece }
      tempPiece = null
      return
    }

    if (!pressed.down) {
      tempPiece = null
      return
    }

    solidifyPiece()
    removeRows()

    tempPiece = getNewPiece()

    if (!detectCollisions(tempPiece)) {
      piece = { ...tempPiece }
      tempPiece = null
      return
    }

    while (tempPiece.positionY >= 0 && detectCollisions(tempPiece)) {
      tempPiece.positionY--
    }

    piece = { ...tempPiece }
    tempPiece = null
    gameOver = true
  }

  const movePiece = (piece: Piece, pressed: Pressed) => {
    if (pressed.left) {
      piece.positionX--
    }

    if (pressed.right) {
      piece.positionX++
    }

    if (pressed.down) {
      piece.positionY++
    }

    return piece
  }

  const rotatePiece = (piece: Piece) => {
    const rotatedShape: number[][] = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row: number[] = []

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }

      rotatedShape.push(row)
    }

    piece.shape = rotatedShape
    return piece
  }

  const detectCollisions = (piece: Piece) => {
    return piece.shape.some((row, y) => {
      return row.some((value, x) => {
        return value === 1 && board[y + piece.positionY]?.[x + piece.positionX]?.value !== 0
      })
    })
  }

  const solidifyPiece = () => {
    if (!piece) {
      return
    }

    const color: string = piece.color
    const positionX: number = piece.positionX
    const positionY: number = piece.positionY

    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          board[y + positionY][x + positionX] = { value: 1, color }
        }
      })
    })
  }

  const removeRows = () => {
    const rowsToRemove: any[] = []

    board.forEach((row, y) => {
      if (row.every(({ value }) => value === 1)) {
        rowsToRemove.push(y)
      }
    })

    rowsToRemove.forEach((y) => {
      board.splice(y, 1)
      board.unshift(getEmptyBoardRow())
      score += BOARD_SCORE
    })
  }

  const resetGame = () => {
    board = getEmptyBoard()
    piece = getNewPiece()
    tempPiece = null
    playing = true
    gameOver = false
    score = 0
    dropTime = 0
    lastTime = 0
    playingGame()
  }
</script>

<main class="relative flex flex-col gap-1 p-2">
  <header class="flex justify-between text-gray-300">
    <span>Score: {score}</span>
    <div class="flex gap-1">
      <button
        class="flex justify-center items-center rounded-full size-5 bg-neutral-700 cursor-pointer"
        onclick={togglePlay}
      >
        <Pause />
      </button>
      <button
        class="flex justify-center items-center rounded-full size-5 bg-neutral-700 cursor-pointer"
        onclick={resetGame}
        title="Reset game"
      >
        <ResetSmall />
      </button>
    </div>
  </header>
  <canvas class="bg-zinc-950 border border-gray-700 rounded"></canvas>
  {#if !playing || gameOver}
    <section class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-neutral-800/90 rounded">
      {#if !gameOver}
        <button
          class="flex gap-2 items-center cursor-pointer transition-all px-8 py-2 text-2xl text-gray-300 hover:text-gray-100 hover:scale-110"
          onclick={togglePlay}
        >
          <Play /> Play
        </button>
      {:else}
        <button
          class="flex gap-2 items-center cursor-pointer transition-all px-8 py-2 text-2xl text-gray-300 hover:text-gray-100 hover:scale-110"
          onclick={resetGame}
        >
          <ResetLarge /> Game over!
        </button>
      {/if}
    </section>
  {/if}
</main>

<svelte:window on:keydown|capture={onKeyDown} />
