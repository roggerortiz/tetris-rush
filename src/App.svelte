<script lang="ts">
  import { onMount } from 'svelte'
  import { Canvas } from './classes/canvas'
  import { EventMovement } from './helpers/enums'

  let canvas: Canvas = $state(new Canvas())

  onMount(() => {
    canvas = new Canvas()
    draw()
  })

  const onKeyDown = ({ key }: KeyboardEvent) => {
    canvas.updatePiece({
      up: key === EventMovement.UP,
      down: key === EventMovement.DOWN,
      left: key === EventMovement.LEFT,
      right: key === EventMovement.RIGHT
    })
  }

  const draw = (time: number = 0) => {
    canvas.draw(time)
    window.requestAnimationFrame(draw)
  }
</script>

<main class="bg-zinc-950 border border-gray-700 rounded overflow-hidden">
  <canvas></canvas>
</main>

<svelte:window on:keydown|capture={onKeyDown} />
