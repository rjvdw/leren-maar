import ms from 'ms'
import { Game } from './game.ts'
import { html, render } from 'lit-html'

const canvas = document.getElementById('game')
if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('could not find canvas element in dom')
}

const game = new Game(canvas, {
  width: 240,
  height: 240,
})
game.initialize()

game.addPlayer('ai')
game.addPlayer('dijkstra')

let fast = false
const INTERVAL_FAST = ms('0.1 seconds')
const INTERVAL_SLOW = ms('0.7 seconds')
const interval = () => (fast ? INTERVAL_FAST : INTERVAL_SLOW)
let lastRender = 0
let round = 0
let handle: number | undefined = undefined
const loop = (time: number) => {
  game.handleInputs()
  if (time - lastRender > interval()) {
    round += 1
    lastRender = time
    game.update()
    updateMeta()
  }
  handle = requestAnimationFrame(loop)
}
updateMeta()

document.getElementById('pause')?.addEventListener('click', (event) => {
  event.preventDefault()
  if (handle === undefined) {
    handle = requestAnimationFrame(loop)
    ;(event.target as HTMLButtonElement).innerHTML = 'Pause'
  } else {
    cancelAnimationFrame(handle)
    handle = undefined
    ;(event.target as HTMLButtonElement).innerHTML = 'Start'
  }
  updateMeta()
})

document.getElementById('toggle-speed')?.addEventListener('click', (event) => {
  event.preventDefault()
  fast = !fast
  updateMeta()
})

window.addEventListener('gamepadconnected', (event) => {
  game.addPlayer('human', event.gamepad)
})

window.removeEventListener('gamepaddisconnected', (event) => {
  game.removePlayer(event.gamepad)
})

function updateMeta() {
  render(
    html`
      <p>Round ${round}${handle === undefined ? ' (paused)' : ''}</p>
      <p>Game is running <b>${fast ? 'fast' : 'slow'}</b></p>
      ${game.scoreboard()}
    `,
    document.getElementById('scoreboard')!,
  )
}
