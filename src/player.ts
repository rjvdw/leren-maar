export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Player {
  get position(): [number, number]
  get color(): string

  hasGamepad(gamepad: Gamepad): boolean
  update(isLegalPosition: (position: [number, number]) => boolean): void
  handleInputs(): void
}
