import { notNull } from './util.ts'
import { GAMEPAD } from './gamepad.ts'
import { Direction, Player } from './player.ts'
import { Controls } from './controls.ts'

export class HumanPlayer implements Player {
  readonly #gamepadId: string
  #direction: Direction | null
  #position: [number, number]
  readonly #color: string
  #buttonState: Record<number, boolean>
  readonly #controls: Controls

  get position(): [number, number] {
    return [...this.#position]
  }

  set position([x, y]: [number, number]) {
    this.#position = [x, y]
  }

  get color(): string {
    return this.#color
  }

  constructor(gamepad: Gamepad, controls: Controls) {
    this.#gamepadId = gamepad.id
    this.#direction = null
    this.#position = [0, 0]
    this.#color = '#c33'
    this.#buttonState = Object.fromEntries(
      Object.values(GAMEPAD).map((idx) => [idx, gamepad.buttons[idx].pressed]),
    )
    this.#controls = controls
  }

  hasGamepad(gamepad: Gamepad) {
    return gamepad.id === this.#gamepadId
  }

  #getGamepad(): Gamepad | undefined {
    return navigator
      .getGamepads()
      .filter(notNull)
      .find((gamepad) => this.hasGamepad(gamepad))
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
  }

  move(): Direction | null {
    return this.#direction
  }
}
