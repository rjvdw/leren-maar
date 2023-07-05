export type Controls = {
  setup(): void
  reset(): void
  start(): void
  pause(): void
  toggle(): void
  toggleSpeed(): void
  toggleAiBot(): void
  toggleTradBot(): void
}

export type Position = [number, number]
