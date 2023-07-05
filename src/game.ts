import { Player } from './player.ts'
import { html } from 'lit-html'
import { HumanPlayer } from './human-player.ts'
import { AiPlayer } from './ai-player.ts'

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
  #treats: [number, number][]
  #scores: WeakMap<Player, number>

  get gridWidth() {
    return Math.floor(this.#canvas.width / this.#gridSize)
  }

  get gridHeight() {
    return Math.floor(this.#canvas.height / this.#gridSize)
  }

  get width(): number {
    return this.gridWidth * this.#gridSize
  }

  set width(w: number) {
    this.#canvas.width = w + 1
  }

  get height(): number {
    return this.gridHeight * this.#gridSize
  }

  set height(h: number) {
    this.#canvas.height = h + 1
  }

  set gridSize(s: number) {
    this.#gridSize = s
  }

  constructor(canvas: HTMLCanvasElement, config: GameConfig = {}) {
    this.#canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('unable to initialize rendering context')
    }
    this.#ctx = ctx

    const { width = 1024, height = 768, gridSize = 10 } = config

    this.width = width
    this.height = height
    this.#gridSize = gridSize
    this.#players = []
    this.#treats = []
    this.#scores = new WeakMap()
  }

  addPlayer(): void
  addPlayer(gamepad: Gamepad): void
  addPlayer(gamepad?: Gamepad): void {
    let player: Player
    if (gamepad === undefined) {
      player = new AiPlayer()
    } else {
      player = new HumanPlayer(gamepad)
    }
    this.#players.push(player)
    this.#scores.set(player, 0)
  }

  removePlayer(gamepad: Gamepad) {
    this.#players = this.#players.filter(
      (player) => !player.hasGamepad(gamepad)
    )
  }

  #addRandomTreat() {
    const x = Math.floor(Math.random() * this.gridWidth)
    const y = Math.floor(Math.random() * this.gridHeight)

    if (!this.#treats.find(([x1, y1]) => x1 === x && y1 === y)) {
      this.#treats.push([x, y])
    }
  }

  #clear() {
    this.#ctx.clearRect(0, 0, this.width, this.height)
  }

  #drawGrid() {
    this.#ctx.beginPath()
    this.#ctx.strokeStyle = '#999'
    this.#ctx.lineWidth = 0.5
    for (let x = 0; x <= this.width; x += this.#gridSize) {
      this.#ctx.moveTo(x + 0.5, -0.5)
      this.#ctx.lineTo(x + 0.5, this.height + 0.5)
    }
    for (let y = 0; y <= this.height; y += this.#gridSize) {
      this.#ctx.moveTo(-0.5, y + 0.5)
      this.#ctx.lineTo(this.width + 0.5, y + 0.5)
    }
    this.#ctx.stroke()
  }

  #clearPlayer(player: Player) {
    const [x, y] = player.position
    this.#ctx.clearRect(
      x * this.#gridSize + 1,
      y * this.#gridSize + 1,
      this.#gridSize - 2,
      this.#gridSize - 2
    )
  }

  #drawCircle([x, y]: [number, number], color: string) {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = color
    this.#ctx.arc(
      x * this.#gridSize + this.#gridSize / 2,
      y * this.#gridSize + this.#gridSize / 2,
      this.#gridSize * 0.3,
      0,
      2 * Math.PI
    )
    this.#ctx.fill()
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
    for (const player of this.#players) {
      this.#clearPlayer(player)
      player.update(
        ([x, y]) =>
          !(x < 0 || y < 0 || x >= this.gridWidth || y >= this.gridHeight)
      )
      this.#drawCircle(player.position, player.color)
      this.#checkTreat(player)
    }

    if (this.#treats.length < MAX_TREATS && Math.random() < 0.1) {
      this.#addRandomTreat()
    }

    for (const treat of this.#treats) {
      this.#drawCircle(treat, '#3c3')
    }
  }

  scoreboard() {
    return html`
      <ul>
        ${this.#players.map(
          (player) => html`<li>Score: ${this.#scores.get(player)}</li>`
        )}
      </ul>
    `
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
