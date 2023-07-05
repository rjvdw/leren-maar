import { Position } from './types.ts'

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Player {
  get position(): Position
  set position(next: Position)
  get color(): string

  hasGamepad(gamepad: Gamepad): boolean
  handleInputs(): void
  move(
    board: { width: number; height: number },
    treats: Position[],
    players: Position[],
  ): Direction | null
}
