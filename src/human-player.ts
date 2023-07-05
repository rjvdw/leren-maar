import { notNull } from './util.ts'
import { GAMEPAD } from './gamepad.ts'
import { Direction, Player } from './player.ts'

export class HumanPlayer implements Player {
  readonly #gamepadId: string
  #direction: Direction | null
  #position: [number, number]
  readonly #color: string
  #buttonState: Record<number, boolean>

  get position(): [number, number] {
    return [...this.#position]
  }

  set position([x, y]: [number, number]) {
    this.#position = [x, y]
  }

  get color(): string {
    return this.#color
  }

  constructor(gamepad: Gamepad) {
    this.#gamepadId = gamepad.id
    this.#direction = null
    this.#position = [0, 0]
    this.#color = '#c33'
    this.#buttonState = {
      [GAMEPAD.UP]: gamepad.buttons[GAMEPAD.UP].pressed,
      [GAMEPAD.DOWN]: gamepad.buttons[GAMEPAD.DOWN].pressed,
      [GAMEPAD.LEFT]: gamepad.buttons[GAMEPAD.LEFT].pressed,
      [GAMEPAD.RIGHT]: gamepad.buttons[GAMEPAD.RIGHT].pressed,
    }
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
        // button pressed
        this.#direction = this.#direction === direction ? null : direction
      }
      this.#buttonState[buttonIdx] = button.pressed
    }
  }

  move(): Direction | null {
    return this.#direction
  }
}
