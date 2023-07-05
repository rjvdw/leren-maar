import { Direction, Player } from './player.ts'
import { BotPlayer } from './bot-player.ts'

export class AiPlayer extends BotPlayer implements Player {
  public readonly color = '#36a'

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
