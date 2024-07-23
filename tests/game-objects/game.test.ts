import { test, describe, expect, beforeEach, vi, afterEach } from "vitest"
import Card, { suit } from "../../src/game-objects/card"
import Game from "../../src/game-objects/game"
import Deck from "../../src/game-objects/deck"
import Player from "../../src/game-objects/player"
import Opponent from "../../src/game-objects/opponent"
import { Outcome } from "../../src/enums"

const hand = [
  {
    id: "4_of_clubs",
    value: 4,
    suit: suit.clubs,
    img: "./cards/4_of_clubs.webp",
  },
  {
    id: "4_of_diamonds",
    value: 4,
    suit: suit.diamonds,
    img: "./cards/4_of_diamonds.webp",
  },
  {
    id: "8_of_diamonds",
    value: 8,
    suit: suit.diamonds,
    img: "./cards/8_of_diamonds.webp",
  },
]

const pairs = [
  {
    id: "4_of_clubs",
    value: 4,
    suit: suit.clubs,
    img: "./cards/4_of_clubs.webp",
  },
  {
    id: "4_of_diamonds",
    value: 4,
    suit: suit.diamonds,
    img: "./cards/4_of_diamonds.webp",
  },
]

describe("game class", () => {
  const dispatchGameAction = vi.fn()
  let game: Game
  let deck: Deck
  let player: Player
  let opponent: Opponent
  let updateUISpy: any

  beforeEach(() => {
    deck = new Deck(Card, dispatchGameAction)
    player = new Player(dispatchGameAction)
    opponent = new Opponent(dispatchGameAction)
    game = new Game(deck, player, opponent, dispatchGameAction)
    updateUISpy = vi.spyOn(game, "updateUI")
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe(".start()", () => {
    test("game starts", () => {
      game.start()
      expect(updateUISpy).toHaveBeenCalled()
      expect(dispatchGameAction).toHaveBeenCalledTimes(2)
    })
  })

  test(".initialPairs()", () => {
    const p = game.initialPairs(hand)
    expect(p).toStrictEqual(pairs)
    expect(p).not.toStrictEqual([])
  })

  test(".updateUI()", () => {
    game.updateUI()
    expect(dispatchGameAction).toHaveBeenCalled()
  })

  describe(".end()", () => {
    test("player wins", () => {
      player.pairs = new Array(10).fill(null)
      opponent.pairs = new Array(5).fill(null)
      game.end()

      expect(game.end()).toBe(true)
      expect(dispatchGameAction).toHaveBeenCalled()
      expect(updateUISpy).toHaveBeenCalled()
      expect(dispatchGameAction.mock.calls[1][0].outcome).toBe(Outcome.Player)
    })

    test("oppponent wins", () => {
      player.pairs = new Array(5).fill(null)
      opponent.pairs = new Array(10).fill(null)
      game.end()

      expect(game.end()).toBe(true)
      expect(dispatchGameAction).toHaveBeenCalled()
      expect(updateUISpy).toHaveBeenCalled()
      expect(dispatchGameAction.mock.calls[1][0].outcome).toBe(Outcome.Opponent)
    })

    test("a draw", () => {
      player.pairs = new Array(10).fill(null)
      opponent.pairs = new Array(10).fill(null)
      game.end()

      expect(game.end()).toBe(true)
      expect(dispatchGameAction).toHaveBeenCalled()
      expect(updateUISpy).toHaveBeenCalled()
      expect(dispatchGameAction.mock.calls[1][0].outcome).toBe(Outcome.Draw)
    })

    test("game has not ended", () => {
      player.hand = new Array(10).fill(null)
      opponent.hand = new Array(10).fill(null)
      game.end()

      expect(game.end()).toBe(false)
    })
  })
})
