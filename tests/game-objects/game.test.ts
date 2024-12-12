import {
  test,
  it,
  describe,
  expect,
  beforeEach,
  vi,
  type MockInstance,
} from "vitest"
import { Deck, Game, Player, Opponent } from "@game-objects"
import { suit, GameAction, Outcome } from "@enums"
import mockDeck from "../__mocks__/deck"

const handMock = [
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

const pairsMock = [
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

describe("Game class", () => {
  //mocks
  const dispatchGameActionMock = vi.fn()

  //game objects
  let deck: Deck
  let player: Player
  let opponent: Opponent
  let game: Game

  //spies
  let updateUISpy: MockInstance
  let initialPairsSpy: MockInstance
  let shuffleSpy: MockInstance
  let dealHandSpy: MockInstance

  beforeEach(() => {
    deck = new Deck(mockDeck, dispatchGameActionMock)
    player = new Player(dispatchGameActionMock)
    opponent = new Opponent(dispatchGameActionMock)
    game = new Game(deck, player, opponent, dispatchGameActionMock)

    updateUISpy = vi.spyOn(game, "updateUI")
    initialPairsSpy = vi.spyOn(game, "initialPairs")
    shuffleSpy = vi.spyOn(deck, "shuffle")

    vi.clearAllMocks()
  })

  describe("start()", () => {
    const log =
      "The cards have been dealt. Any initial pair of cards have been added to your Pairs. Please select a card from your hand to request a match with your opponent."

    it("calls internal methods with correct arguments", () => {
      game.start()
      expect(shuffleSpy).toHaveBeenCalledOnce()
      expect(initialPairsSpy).toHaveBeenCalledTimes(2)
      expect(updateUISpy).toHaveBeenCalledWith(true)
      expect(dispatchGameActionMock).toHaveBeenCalledTimes(2)
      expect(dispatchGameActionMock.mock.calls[1][0]).toStrictEqual({
        action: GameAction.GAME_LOG,
        log,
      })
    })
  })

  describe("initialPairs()", () => {
    it("returns initial pairs", () => {
      const pairs = game.initialPairs(handMock)
      expect(pairs).toStrictEqual(pairsMock)
    })
  })

  describe("updateUI()", () => {
    it("calls internal methods with correct arguments", () => {
      game.updateUI()
      expect(dispatchGameActionMock).toHaveBeenCalledOnce()
    })
  })

  describe("outcome()", () => {
    test("player has more pairs", () => {
      player.pairs = new Array(10).fill(null)
      opponent.pairs = new Array(5).fill(null)

      expect(game.outcome()).toBe(Outcome.Player)
    })

    test("player and opponent have equal amount of pairs", () => {
      player.pairs = new Array(10).fill(null)
      opponent.pairs = new Array(10).fill(null)

      expect(game.outcome()).toBe(Outcome.Draw)
    })

    test("opponent has more pairs", () => {
      player.pairs = new Array(5).fill(null)
      opponent.pairs = new Array(10).fill(null)

      expect(game.outcome()).toBe(Outcome.Opponent)
    })
  })

  describe("end()", () => {
    it("checks internal functions are called with correct arguments", () => {
      const gameEnd = game.end()
      expect(gameEnd).toBe(true)
      expect(dispatchGameActionMock).toHaveBeenCalledTimes(2)
      expect(updateUISpy).toHaveBeenCalledOnce()
    })

    test("player wins", () => {
      player.pairs = new Array(10).fill(null)
      opponent.pairs = new Array(5).fill(null)
      game.end()

      expect(dispatchGameActionMock.mock.calls[1][0]).toStrictEqual({
        action: GameAction.GAME_OVER,
        outcome: Outcome.Player,
        gameOver: true,
      })
    })

    test("oppponent wins", () => {
      player.pairs = new Array(5).fill(null)
      opponent.pairs = new Array(10).fill(null)
      game.end()

      expect(dispatchGameActionMock.mock.calls[1][0]).toStrictEqual({
        action: GameAction.GAME_OVER,
        outcome: Outcome.Opponent,
        gameOver: true,
      })
    })

    test("a draw", () => {
      player.pairs = new Array(10).fill(null)
      opponent.pairs = new Array(10).fill(null)
      game.end()
      expect(dispatchGameActionMock.mock.calls[1][0]).toStrictEqual({
        action: GameAction.GAME_OVER,
        outcome: Outcome.Draw,
        gameOver: true,
      })
    })

    test("game has not ended", () => {
      //simulate ongoing game
      player.hand = new Array(10).fill(null)
      opponent.hand = new Array(10).fill(null)

      const gameEnd = game.end()

      expect(gameEnd).toBe(false)
    })
  })
})
