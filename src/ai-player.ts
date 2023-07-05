import { Direction, Player } from './player.ts'

export class AiPlayer implements Player {
  #position: [number, number] = [0, 0]

  get color(): string {
    return '#36a'
  }

  handleInputs(): void {}

  hasGamepad(): boolean {
    return false
  }

  get position(): [number, number] {
    return [...this.#position]
  }

  set position([x, y]: [number, number]) {
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
