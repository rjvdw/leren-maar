import { Player } from './player.ts'

export class AiPlayer implements Player {
  #position: [number, number] = [0, 0]

  get color(): string {
    return '#36a'
  }

  handleInputs(): void {}

  hasGamepad(_gamepad: Gamepad): boolean {
    return false
  }

  get position(): [number, number] {
    return this.#position
  }

  update(isLegalPosition: (position: [number, number]) => boolean): void {
    const rnd = Math.random()
    const [x, y] = this.#position
    let next: [number, number]

    if (rnd < 0.25) {
      next = [x, y + 1]
    } else if (rnd < 0.5) {
      next = [x, y - 1]
    } else if (rnd < 0.75) {
      next = [x + 1, y]
    } else {
      next = [x - 1, y]
    }

    if (isLegalPosition(next)) {
      this.#position = next
    }
  }
}
