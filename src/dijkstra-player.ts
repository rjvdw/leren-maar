import { Direction, Player } from './player.ts'
import { Position } from './types.ts'

export class DijkstraPlayer implements Player {
  #position: Position = [0, 0]

  get position(): Position {
    return [...this.#position]
  }

  set position([x, y]: Position) {
    this.#position = [x, y]
  }

  get color(): string {
    return '#c6c'
  }

  handleInputs(): void {}

  hasGamepad(): boolean {
    return false
  }

  move(
    board: { width: number; height: number },
    treats: Position[],
  ): Direction | null {
    let treat = this.#findClosestTreat(treats)
    if (treat === undefined) {
      treat = [Math.floor(board.width / 2), Math.floor(board.height / 2)]
    }

    if (this.#position[1] > treat[1]) {
      return Direction.UP
    }
    if (this.#position[1] < treat[1]) {
      return Direction.DOWN
    }
    if (this.#position[0] > treat[0]) {
      return Direction.LEFT
    }
    if (this.#position[0] < treat[0]) {
      return Direction.RIGHT
    }
    return null
  }

  #findClosestTreat(treats: Position[]): Position | undefined {
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

  #distance([x0, y0]: Position, [x1, y1]: Position): number {
    return Math.abs(x0 - x1) + Math.abs(y0 - y1)
  }
}
