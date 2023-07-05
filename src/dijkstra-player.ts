import { Direction, Player } from './player.ts'

export class DijkstraPlayer implements Player {
  #position: [number, number] = [0, 0]

  get position(): [number, number] {
    return [...this.#position]
  }

  set position([x, y]: [number, number]) {
    this.#position = [x, y]
  }

  get color(): string {
    return '#c6c'
  }

  handleInputs(): void {}

  hasGamepad(): boolean {
    return false
  }

  move(treats: [number, number][]): Direction | null {
    const treat = this.#findClosestTreat(treats)

    if (treat === undefined) {
      return null
    }

    if (treat[0] < this.#position[0]) {
      return Direction.LEFT
    }
    if (treat[0] > this.#position[0]) {
      return Direction.RIGHT
    }
    if (treat[1] < this.#position[1]) {
      return Direction.UP
    }
    return Direction.DOWN
  }

  #findClosestTreat(treats: [number, number][]): [number, number] | undefined {
    let closest = undefined

    for (const treat of treats) {
      if (closest === undefined) {
        closest = treat
      } else {
        if (
          this.#distance(this.#position, treat) <
          this.#distance(this.#position, closest)
        ) {
          closest = treat
        }
      }
    }

    return closest
  }

  #distance([x0, y0]: [number, number], [x1, y1]: [number, number]): number {
    return Math.abs(x0 - x1) + Math.abs(y0 - y1)
  }
}
