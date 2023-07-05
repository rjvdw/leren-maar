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

const INTERVAL = ms('0.1 seconds')
let lastRender = 0
let round = 0
const loop = (time: number) => {
  round += 1
  game.handleInputs()
  if (time - lastRender > INTERVAL) {
    lastRender = time
    game.update()
    render(
      html`
        <p>Round ${round}</p>
        ${game.scoreboard()}
      `,
      document.getElementById('scoreboard')!,
    )
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

window.addEventListener('gamepadconnected', (event) => {
  game.addPlayer('human', event.gamepad)
})

window.removeEventListener('gamepaddisconnected', (event) => {
  game.removePlayer(event.gamepad)
})
