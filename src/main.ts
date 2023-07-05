import { Game } from './game.ts'

const canvas = document.getElementById('game')
if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('could not find canvas element in dom')
}

const game = new Game(canvas)
game.initialize()

const loop = () => {
  game.render()
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

window.addEventListener('gamepadconnected', (event) => {
  game.addPlayer(event.gamepad)
})

window.removeEventListener('gamepaddisconnected', (event) => {
  game.removePlayer(event.gamepad)
})
