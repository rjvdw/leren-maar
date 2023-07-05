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

  update(isLegalPosition: (position: [number, number]) => boolean) {
    const oldPosition = this.#position
    this.#step()
    if (!isLegalPosition(this.#position)) {
      this.#position = oldPosition
      this.#direction = null
    }
  }

  #step() {
    const [x, y] = this.#position
    if (this.#direction === Direction.UP) {
      this.#position = [x, y - 1]
    }
    if (this.#direction === Direction.DOWN) {
      this.#position = [x, y + 1]
    }
    if (this.#direction === Direction.LEFT) {
      this.#position = [x - 1, y]
    }
    if (this.#direction === Direction.RIGHT) {
      this.#position = [x + 1, y]
    }
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
}
