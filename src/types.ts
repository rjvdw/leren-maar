import { Player } from './player.ts'

export type Controls = {
  setup(): void
  reset(): void
  draw(): void
  clearPlayer(player: Player): void
  start(): void
  pause(): void
  toggle(): void
  toggleSpeed(): void
  toggleAiBot(): void
  toggleTradBot(): void
}

export type Position = [number, number]
