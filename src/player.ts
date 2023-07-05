export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Player {
  get position(): [number, number]
  set position(next: [number, number])
  get color(): string

  hasGamepad(gamepad: Gamepad): boolean
  handleInputs(): void
  move(
    board: { width: number; height: number },
    treats: [number, number][],
    players: [number, number][],
  ): Direction | null
}
