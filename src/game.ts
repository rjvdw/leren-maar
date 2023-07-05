import { Direction, Player } from './player.ts'
import { html } from 'lit-html'
import { HumanPlayer } from './human-player.ts'
import { AiPlayer } from './ai-player.ts'
import { DijkstraPlayer } from './dijkstra-player.ts'
import { Controls, Position } from './types.ts'

const MAX_TREATS = 5

export type GameConfig = {
  width?: number
  height?: number
  gridSize?: number
}

export class Game {
  readonly #canvas: HTMLCanvasElement
  readonly #ctx: CanvasRenderingContext2D
  #gridSize: number
  #players: Player[]
  #treats: Position[]
  #scores: WeakMap<Player, number>

  constructor(canvas: HTMLCanvasElement, config: GameConfig = {}) {
    this.#canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('unable to initialize rendering context')
    }
    this.#ctx = ctx

    const { width = 20, height = 20, gridSize = 24 } = config

    this.#gridSize = gridSize
    this.width = width
    this.height = height
    this.#players = []
    this.#treats = []
    this.#scores = new WeakMap()
  }

  get width() {
    return Math.floor(this.#canvas.width / this.#gridSize)
  }

  set width(w: number) {
    this.canvasWidth = w * this.#gridSize
  }

  get height() {
    return Math.floor(this.#canvas.height / this.#gridSize)
  }

  set height(h: number) {
    this.canvasHeight = h * this.#gridSize
  }

  get canvasWidth(): number {
    return this.#canvas.width
  }

  set canvasWidth(w: number) {
    this.#canvas.width = w + 1
  }

  get canvasHeight(): number {
    return this.#canvas.height
  }

  set canvasHeight(h: number) {
    this.#canvas.height = h + 1
  }

  reset() {
    this.#players = this.#players.filter(
      (player) => player instanceof HumanPlayer,
    )
    for (const player of this.#players) {
      this.#scores.set(player, 0)
      player.position = [0, 0]
    }
    this.#treats = []
    this.initialize()
    this.draw()
  }

  addPlayer(type: 'ai'): void
  addPlayer(type: 'dijkstra'): void
  addPlayer(type: 'human', gamepad: Gamepad, controls: Controls): void
  addPlayer(
    type: 'ai' | 'dijkstra' | 'human',
    gamepad?: Gamepad,
    controls?: Controls,
  ): void {
    let player: Player
    if (type === 'ai') {
      player = new AiPlayer()
    } else if (type === 'dijkstra') {
      player = new DijkstraPlayer()
    } else if (gamepad && controls) {
      player = new HumanPlayer(gamepad, controls)
    } else {
      throw new Error(`player with type ${type} could not be initiated`)
    }
    this.#players.push(player)
    this.#scores.set(player, 0)
    this.draw()
  }

  removePlayer(cls: typeof AiPlayer): void
  removePlayer(cls: typeof DijkstraPlayer): void
  removePlayer(gamepad: Gamepad): void
  removePlayer(arg: typeof AiPlayer | typeof DijkstraPlayer | Gamepad) {
    if (arg === AiPlayer) {
      this.#players = this.#players.filter(
        (player) => !(player instanceof AiPlayer),
      )
    } else if (arg === DijkstraPlayer) {
      this.#players = this.#players.filter(
        (player) => !(player instanceof DijkstraPlayer),
      )
    } else {
      this.#players = this.#players.filter(
        (player) => !player.hasGamepad(arg as Gamepad),
      )
    }

    this.initialize()
    this.draw()
  }

  initialize() {
    this.#clear()
    this.#drawGrid()
  }

  handleInputs() {
    for (const player of this.#players) {
      player.handleInputs()
    }
  }

  update() {
    if (Math.random() < treatDistribution(this.#treats.length, MAX_TREATS)) {
      this.#addRandomTreat()
    }

    for (const player of this.#players) {
      this.#clearPlayer(player)
      const dir = player.move(
        { width: this.width, height: this.height },
        [...this.#treats],
        this.#players.filter((p) => p !== player).map((p) => p.position),
      )
      let [x, y] = player.position
      switch (dir) {
        case Direction.UP:
          y -= 1
          break
        case Direction.DOWN:
          y += 1
          break
        case Direction.LEFT:
          x -= 1
          break
        case Direction.RIGHT:
          x += 1
          break
      }

      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        player.position = [x, y]
      }

      this.#checkTreat(player)
    }

    this.draw()
  }

  draw() {
    for (const player of this.#players) {
      this.#drawCircle(player.position, player.color)
    }

    for (const treat of this.#treats) {
      this.#drawCircle(treat, '#3c3')
    }
  }

  scoreboard() {
    return html`
      ${this.#players.map((player) => this.#scoreboardPlayer(player))}
    `
  }

  #scoreboardPlayer(player: Player) {
    let name: string
    if (player instanceof AiPlayer) {
      name = 'AI bot'
    } else if (player instanceof DijkstraPlayer) {
      name = 'Traditional bot'
    } else if (player instanceof HumanPlayer) {
      name = 'Human'
    } else {
      name = 'Player'
    }

    return html` <p>${name}: ${this.#scores.get(player)}</p> `
  }

  #addRandomTreat() {
    const x = Math.floor(Math.random() * this.width)
    const y = Math.floor(Math.random() * this.height)

    if (!this.#treats.find(([x1, y1]) => x1 === x && y1 === y)) {
      this.#treats.push([x, y])
    }
  }

  #clear() {
    this.#ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  #drawGrid() {
    this.#ctx.beginPath()
    this.#ctx.strokeStyle = '#999'
    this.#ctx.lineWidth = 0.5
    for (let x = 0; x <= this.canvasWidth; x += this.#gridSize) {
      this.#ctx.moveTo(x + 0.5, -0.5)
      this.#ctx.lineTo(x + 0.5, this.canvasHeight + 0.5)
    }
    for (let y = 0; y <= this.canvasHeight; y += this.#gridSize) {
      this.#ctx.moveTo(-0.5, y + 0.5)
      this.#ctx.lineTo(this.canvasWidth + 0.5, y + 0.5)
    }
    this.#ctx.stroke()
  }

  #clearPlayer(player: Player) {
    const [x, y] = player.position
    this.#ctx.clearRect(
      x * this.#gridSize + 1,
      y * this.#gridSize + 1,
      this.#gridSize - 2,
      this.#gridSize - 2,
    )
  }

  #drawCircle([x, y]: Position, color: string) {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = color
    this.#ctx.arc(
      x * this.#gridSize + this.#gridSize / 2,
      y * this.#gridSize + this.#gridSize / 2,
      this.#gridSize * 0.3,
      0,
      2 * Math.PI,
    )
    this.#ctx.fill()
  }

  #checkTreat(player: Player) {
    const [px, py] = player.position
    for (const [tx, ty] of this.#treats) {
      if (tx === px && ty === py) {
        this.#treats = this.#treats.filter(([tx, ty]) => tx !== px || ty !== py)
        this.#scores.set(player, (this.#scores.get(player) ?? 0) + 1)
      }
    }
  }
}

/**
 * Creates a distribution for when new treats are generated.
 *
 * When there are more treats on the board, the chance that a new treat is generated decreases.
 *
 * @param current The current number of treats on the board.
 * @param max     The maximum number of treats allowed on the board.
 * @return The chance that a new treat should be generated.
 */
function treatDistribution(current: number, max: number): number {
  if (current >= max) {
    return 0
  }

  const yScalingFactor = 4
  const xScalingFactor = 2
  const xOffset = 1

  const effectiveRange = xScalingFactor + max
  const numerator = effectiveRange - current
  const denominator = effectiveRange + xOffset

  return (numerator / denominator) ** yScalingFactor
}
