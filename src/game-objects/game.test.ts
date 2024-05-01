import { test, describe, expect, beforeEach, vi, afterEach } from "vitest"
import Game from "./game"
import Deck from "./deck"
import Player from "./player"
import Opponent from "./opponent"
import { Outcome } from "../types/enums"
import { suit } from "./card"

const hand = [
  {
    id: "4_of_clubs",
    value: 4,
    suit: suit.clubs,
    img: "./cards/4_of_clubs.png",
  },
  {
    id: "4_of_diamonds",
    value: 4,
    suit: suit.diamonds,
    img: "./cards/4_of_diamonds.png",
  },
  {
    id: "8_of_diamonds",
    value: 8,
    suit: suit.diamonds,
    img: "./cards/8_of_diamonds.png",
  },
]

const pairs = [
  {
    id: "4_of_clubs",
    value: 4,
    suit: suit.clubs,
    img: "./cards/4_of_clubs.png",
  },
  {
    id: "4_of_diamonds",
    value: 4,
    suit: suit.diamonds,
    img: "./cards/4_of_diamonds.png",
  },
]

describe("game class", () => {
  let game: Game
  let deck: Deck
  let player: Player = new Player()
  let opponent: Opponent = new Opponent()
  const dispatchGameAction = vi.fn()
  let updateUISpy: any

  beforeEach(() => {
    game = new Game()
    updateUISpy = vi.spyOn(game, "updateUI")
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test(".start()", () => {
    game.start(dispatchGameAction)
    expect(updateUISpy).toHaveBeenCalled()
    expect(dispatchGameAction).toHaveBeenCalledTimes(2)
  })

  test(".initialPairs()", () => {
    const p = game.initialPairs(hand)
    expect(p).toStrictEqual(pairs)
    expect(p).not.toStrictEqual([])
  })

  test(".updateUI()", () => {
    game.updateUI(deck, player, opponent, dispatchGameAction)
    expect(dispatchGameAction).toHaveBeenCalled()
  })

  test(".end() player wins", () => {
    player.pairs = new Array(10).fill(null)
    opponent.pairs = new Array(5).fill(null)
    game.end(deck, player, opponent, dispatchGameAction)

    expect(game.end(deck, player, opponent, dispatchGameAction)).toBe(true)
    expect(dispatchGameAction).toHaveBeenCalled()
    expect(updateUISpy).toHaveBeenCalled()
    expect(dispatchGameAction.mock.calls[1][0].outcome).toBe(Outcome.Player)
  })

  test(".end() oppponent wins", () => {
    player.pairs = new Array(5).fill(null)
    opponent.pairs = new Array(10).fill(null)
    game.end(deck, player, opponent, dispatchGameAction)

    expect(game.end(deck, player, opponent, dispatchGameAction)).toBe(true)
    expect(dispatchGameAction).toHaveBeenCalled()
    expect(updateUISpy).toHaveBeenCalled()
    expect(dispatchGameAction.mock.calls[1][0].outcome).toBe(Outcome.Opponent)
  })

  test(".end() draw", () => {
    player.pairs = new Array(10).fill(null)
    opponent.pairs = new Array(10).fill(null)
    game.end(deck, player, opponent, dispatchGameAction)

    expect(game.end(deck, player, opponent, dispatchGameAction)).toBe(true)
    expect(dispatchGameAction).toHaveBeenCalled()
    expect(updateUISpy).toHaveBeenCalled()
    expect(dispatchGameAction.mock.calls[1][0].outcome).toBe(Outcome.Draw)
  })

  test(".end() return false", () => {
    player.hand = new Array(10).fill(null)
    opponent.hand = new Array(10).fill(null)
    deck = new Deck()
    game.end(deck, player, opponent, dispatchGameAction)

    expect(game.end(deck, player, opponent, dispatchGameAction)).toBe(false)
  })
})
