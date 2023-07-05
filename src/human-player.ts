import { notNull } from './util.ts'
import { GAMEPAD } from './gamepad.ts'
import { Direction, Player } from './player.ts'
import { Controls, Position } from './types.ts'

export class HumanPlayer implements Player {
  public readonly color = '#c33'
  public position: Position = [0, 0]
  readonly #gamepadId: string
  #direction: Direction | null = null
  #buttonState: Record<number, boolean>
  readonly #controls: Controls
  #active: boolean = false

  get active() {
    return this.#active
  }

  constructor(gamepad: Gamepad, controls: Controls) {
    this.#gamepadId = gamepad.id
    this.#buttonState = Object.fromEntries(
      Object.values(GAMEPAD).map((idx) => [idx, gamepad.buttons[idx].pressed]),
    )
    this.#controls = controls
  }

  hasGamepad(gamepad: Gamepad) {
    return gamepad.id === this.#gamepadId
  }

  handleInputs() {
    const gamepad = this.#getGamepad()
    if (!gamepad) {
      console.error('gamepad not available for player', this)
      return
    }

    const dirs = [
      [Direction.UP, GAMEPAD.UP],
      [Direction.DOWN, GAMEPAD.DOWN],
      [Direction.LEFT, GAMEPAD.LEFT],
      [Direction.RIGHT, GAMEPAD.RIGHT],
    ]

    for (const [direction, buttonIdx] of dirs) {
      const button = gamepad.buttons[buttonIdx]

      if (button.pressed && !this.#buttonState[buttonIdx]) {
        this.#direction = this.#direction === direction ? null : direction
      }
      this.#buttonState[buttonIdx] = button.pressed
    }

    const startButton = gamepad.buttons[GAMEPAD.START]
    if (startButton.pressed && !this.#buttonState[GAMEPAD.START]) {
      this.#controls.toggle()
    }
    this.#buttonState[GAMEPAD.START] = startButton.pressed

    const selectButton = gamepad.buttons[GAMEPAD.SELECT]
    if (selectButton.pressed && !this.#buttonState[GAMEPAD.SELECT]) {
      this.#controls.toggleSpeed()
    }
    this.#buttonState[GAMEPAD.SELECT] = selectButton.pressed

    const aButton = gamepad.buttons[GAMEPAD.A]
    if (aButton.pressed && !this.#buttonState[GAMEPAD.A]) {
      this.#active = true
      this.#controls.draw()
    }
    this.#buttonState[GAMEPAD.A] = aButton.pressed

    const bButton = gamepad.buttons[GAMEPAD.B]
    if (bButton.pressed && !this.#buttonState[GAMEPAD.B]) {
      this.#active = false
      this.#controls.clearPlayer(this)
    }
    this.#buttonState[GAMEPAD.B] = bButton.pressed

    const xButton = gamepad.buttons[GAMEPAD.X]
    if (xButton.pressed && !this.#buttonState[GAMEPAD.X]) {
      this.#controls.reset()
    }
    this.#buttonState[GAMEPAD.X] = xButton.pressed

    const rbButton = gamepad.buttons[GAMEPAD.RB]
    if (rbButton.pressed && !this.#buttonState[GAMEPAD.RB]) {
      this.#controls.toggleAiBot()
    }
    this.#buttonState[GAMEPAD.RB] = rbButton.pressed

    const lbButton = gamepad.buttons[GAMEPAD.LB]
    if (lbButton.pressed && !this.#buttonState[GAMEPAD.LB]) {
      this.#controls.toggleTradBot()
    }
    this.#buttonState[GAMEPAD.LB] = lbButton.pressed
  }

  move(): Direction | null {
    return this.#direction
  }

  #getGamepad(): Gamepad | undefined {
    return navigator
      .getGamepads()
      .filter(notNull)
      .find((gamepad) => this.hasGamepad(gamepad))
  }
}
