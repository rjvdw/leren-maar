import { notNull } from './util.ts'
import { GAMEPAD } from './gamepad.ts'

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export class Player {
  readonly #gamepadId: string
  #direction: Direction | null
  #position: [number, number]
  readonly #color: string
  #buttonState: Record<number, boolean>

  get gamepad(): Gamepad | undefined {
    return navigator
      .getGamepads()
      .filter(notNull)
      .find((gamepad) => this.hasGamepad(gamepad))
  }

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

  update(isLegalPosition: (position: [number, number]) => boolean) {
    const gamepad = this.gamepad
    if (!gamepad) {
      console.error('gamepad not available for player', this)
      return
    }

    this.#updateDirection(gamepad)
    const oldPosition = this.#position
    this.#step()
    if (!isLegalPosition(this.#position)) {
      this.#position = oldPosition
      this.#direction = null
    }
  }

  #updateDirection(gamepad: Gamepad) {
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
}
