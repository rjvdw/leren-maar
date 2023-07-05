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
}
