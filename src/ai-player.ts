import { Direction, Player } from './player.ts'
import { Position } from './types.ts'

export class AiPlayer implements Player {
  #position: Position = [0, 0]

  get color(): string {
    return '#36a'
  }

  handleInputs(): void {}

  hasGamepad(): boolean {
    return false
  }

  get position(): Position {
    return [...this.#position]
  }

  set position([x, y]: Position) {
    this.#position = [x, y]
  }

  move(): Direction | null {
    const rnd = Math.random()
    if (rnd < 0.25) {
      return Direction.UP
    } else if (rnd < 0.5) {
      return Direction.DOWN
    } else if (rnd < 0.75) {
      return Direction.LEFT
    } else {
      return Direction.RIGHT
    }
  }
}
