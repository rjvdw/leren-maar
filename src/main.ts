import ms from 'ms'
import { Game } from './game.ts'
import { html, render } from 'lit-html'
import { Controls } from './types.ts'

const canvas = document.getElementById('game')
if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('could not find canvas element in dom')
}

const game = new Game(canvas)
let paused = true
let fast = false
let lastRender = 0
let round = 0

const controls: Controls = {
  setup() {
    controls.pause()
    round = 0
    game.initialize()
    game.addPlayer('ai')
    game.addPlayer('dijkstra')
    game.draw()
  },

  start() {
    paused = false
    ;(document.getElementById('pause') as HTMLButtonElement).innerHTML = 'Pause'
  },

  pause() {
    paused = true
    ;(document.getElementById('pause') as HTMLButtonElement).innerHTML = 'Start'
  },

  toggle() {
    if (paused) {
      controls.start()
    } else {
      controls.pause()
    }
  },

  toggleSpeed() {
    fast = !fast
  },
}

controls.setup()

const INTERVAL_FAST = ms('0.1 seconds')
const INTERVAL_SLOW = ms('0.7 seconds')
const interval = () => (fast ? INTERVAL_FAST : INTERVAL_SLOW)
const loop = (time: number) => {
  game.handleInputs()
  if (!paused && time - lastRender > interval()) {
    round += 1
    lastRender = time
    game.update()
  }
  render(
    html`
      <p>Round ${round}${paused ? ' (paused)' : ''}</p>
      <p>Game is running <b>${fast ? 'fast' : 'slow'}</b></p>
      ${game.scoreboard()}
    `,
    document.getElementById('scoreboard')!,
  )
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

document.getElementById('pause')?.addEventListener('click', (event) => {
  event.preventDefault()
  controls.toggle()
})

document.getElementById('toggle-speed')?.addEventListener('click', (event) => {
  event.preventDefault()
  controls.toggleSpeed()
})

document.getElementById('reset')?.addEventListener('click', (event) => {
  event.preventDefault()
  controls.setup()
})

window.addEventListener('gamepadconnected', (event) => {
  game.addPlayer('human', event.gamepad, controls)
})

window.removeEventListener('gamepaddisconnected', (event) => {
  game.removePlayer(event.gamepad)
})
