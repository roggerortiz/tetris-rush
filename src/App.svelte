<script lang="ts">
  import { onMount } from 'svelte'
  import { Canvas } from './classes/canvas'
  import { EventKey } from './helpers/enums'
  import Pause from './icons/pause.svelte'
  import Play from './icons/play.svelte'
  import type { TPressed } from './types/pressed'

  let canvas: Canvas = new Canvas()
  let score: number = $state(0)
  let dropTime: number = $state(0)
  let lastTime: number = $state(0)
  let playing: boolean = $state(false)

  onMount(() => {
    canvas.create()
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

    if (playing) {
      playingGame()
    }
  }

  const playingGame = (time: number = 0) => {
    if (canvas.gameOver) {
      playing = false
      return
    }

    autoDrop(time)
    canvas.drawBoard()
    canvas.drawPiece()
    score = canvas.getScore()

    if (playing) {
      window.requestAnimationFrame(playingGame)
    }
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

  const updatePiece = (pressed: TPressed) => {
    canvas.updatePiece(pressed)
  }
</script>

<main class="relative flex flex-col gap-1 p-2">
  <header class="flex justify-between text-gray-300">
    <span>Score: {score}</span>
    <button
      class="flex justify-center items-center rounded-full size-5 bg-neutral-700 cursor-pointer"
      onclick={togglePlay}
    >
      <Pause />
    </button>
  </header>
  <canvas class="bg-zinc-950 border border-gray-700 rounded"></canvas>
  {#if !playing}
    <section class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-neutral-800/90 rounded">
      <button
        class="flex gap-2 items-center cursor-pointer transition-all px-8 py-2 text-2xl text-gray-300 hover:text-gray-100 hover:scale-110"
        onclick={togglePlay}
      >
        <Play /> Play
      </button>
    </section>
  {/if}
</main>

<svelte:window on:keydown|capture={onKeyDown} />
