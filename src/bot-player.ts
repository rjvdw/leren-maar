import { Position } from './types.ts'

export class BotPlayer {
  public position: Position = [0, 0]

  /**
   * bots do not need to handle inputs
   */
  handleInputs(): void {}

  /**
   * bots do not have a gamepad
   */
  hasGamepad(): boolean {
    return false
  }

  protected findTarget(
    board: { width: number; height: number },
    treats: Position[],
  ) {
    let target = this.#findClosestTreat(treats)
    if (target === undefined) {
      target = [Math.floor(board.width / 2), Math.floor(board.height / 2)]
    }

    return target
  }

  #findClosestTreat(treats: Position[]): Position | undefined {
    let closest = undefined

    for (const treat of treats) {
      if (closest === undefined) {
        closest = treat
      } else {
        if (
          this.#distance(this.position, treat) <
          this.#distance(this.position, closest)
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
