import { Direction, Player } from './player.ts'
import { Position } from './types.ts'
import { BotPlayer } from './bot-player.ts'

export class DijkstraPlayer extends BotPlayer implements Player {
  public readonly color = '#c6c'

  move(
    board: { width: number; height: number },
    treats: Position[],
  ): Direction | null {
    const treat = this.findTarget(board, treats)

    if (this.position[1] > treat[1]) {
      return Direction.UP
    }
    if (this.position[1] < treat[1]) {
      return Direction.DOWN
    }
    if (this.position[0] > treat[0]) {
      return Direction.LEFT
    }
    if (this.position[0] < treat[0]) {
      return Direction.RIGHT
    }
    return null
  }
}
