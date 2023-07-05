import { Direction, Player } from './player.ts'
import { BotPlayer } from './bot-player.ts'
import { Position } from './types.ts'

type InputVector = [number, number, number, number]
type OutputVector = [number, number, number, number]

export class AiPlayer extends BotPlayer implements Player {
  public readonly color = '#36a'

  move(
    board: { width: number; height: number },
    treats: Position[],
  ): Direction | null {
    const treat = this.findTarget(board, treats)

    const inputs: InputVector = [
      2 * (this.position[0] / board.width) - 1,
      2 * (this.position[1] / board.height) - 1,
      2 * (treat[0] / board.width) - 1,
      2 * (treat[1] / board.height) - 1,
    ]

    const outputs = this.#predict(inputs)
    return this.#determineDirection(outputs)
  }

  #predict(inputs: InputVector): OutputVector {
    console.log(inputs)

    const rnd = Math.random()
    if (rnd < 0.25) {
      return [1, -1, -1, -1]
    } else if (rnd < 0.5) {
      return [-1, 1, -1, -1]
    } else if (rnd < 0.75) {
      return [-1, -1, 1, -1]
    } else {
      return [-1, -1, -1, 1]
    }
  }

  #determineDirection(outputs: OutputVector): Direction {
    let max = 0

    outputs.forEach((v, i) => {
      if (v > outputs[max]) {
        max = i
      }
    })

    switch (max) {
      case 0:
        return Direction.UP
      case 1:
        return Direction.DOWN
      case 2:
        return Direction.LEFT
      default:
        return Direction.RIGHT
    }
  }
}
