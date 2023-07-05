import ms from 'ms'
import { Game } from './game.ts'
import { render } from 'lit-html'

const canvas = document.getElementById('game')
if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('could not find canvas element in dom')
}

const game = new Game(canvas)
game.initialize()

const INTERVAL = ms('0.2 seconds')
let lastRender = 0
const loop = (time: number) => {
  game.handleInputs()
  if (time - lastRender > INTERVAL) {
    lastRender = time
    game.update()
    render(game.scoreboard(), document.getElementById('scoreboard')!)
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

window.addEventListener('gamepadconnected', (event) => {
  game.addPlayer(event.gamepad)
})

window.removeEventListener('gamepaddisconnected', (event) => {
  game.removePlayer(event.gamepad)
})
