import { GameController } from "@singleplayer-game-controller"
import {
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  test,
  vi,
} from "vitest"
import { deck } from "@assets"
import type { card, handleAction } from "@types"
import { Action, Outcome, PlayerOutput, Suit } from "@enums"

describe("Game Controller", () => {
  let game: GameController
  let handleActionSpy: MockInstance
  let shuffleDeckSpy: MockInstance
  let updateUISpy: MockInstance
  let initialPairsSpy: MockInstance
  let playerMatchSpy: MockInstance
  let opponentTurnSpy: MockInstance
  let setOpponetTurnSpy: MockInstance
  let opponentDealsSpy: MockInstance
  let playerDealsOutputSpy: MockInstance
  let dealFromDeckSpy: MockInstance
  let gameOverSpy: MockInstance
  let handMock: card[]

  beforeEach(() => {
    const handleActionMock = vi.fn() as handleAction
    game = new GameController(deck, handleActionMock)
    handleActionSpy = vi.spyOn(game, "handleAction")
    shuffleDeckSpy = vi.spyOn(game, "shuffleDeck")
    updateUISpy = vi.spyOn(game, "updateUI")
    initialPairsSpy = vi.spyOn(game, "initialPairs")
    playerMatchSpy = vi.spyOn(game, "playerTurnOutput")
    opponentTurnSpy = vi.spyOn(game, "opponentTurn")
    setOpponetTurnSpy = vi.spyOn(game, "setOpponentTurn")
    opponentDealsSpy = vi.spyOn(game, "opponentDeals")
    playerDealsOutputSpy = vi.spyOn(game, "playerDealsOutput")
    dealFromDeckSpy = vi.spyOn(game, "dealFromDeck")
    gameOverSpy = vi.spyOn(game, "over")
    handMock = [
      {
        id: "4_of_clubs",
        value: 4,
        suit: Suit.clubs,
        img: "./cards/4_of_clubs.webp",
      },
      {
        id: "4_of_diamonds",
        value: 4,
        suit: Suit.diamonds,
        img: "./cards/4_of_diamonds.webp",
      },
      {
        id: "8_of_diamonds",
        value: 8,
        suit: Suit.diamonds,
        img: "./cards/8_of_diamonds.webp",
      },
    ]
  })

  describe("start()", () => {
    it("initialises the game", () => {
      const log = "hello world"
      game.start(log)
      expect(shuffleDeckSpy).toHaveBeenCalledOnce()
      expect(game.deck.length).toBe(52 - 2 * game.initialHandSize)
      expect(initialPairsSpy).toHaveBeenCalledTimes(2)
      expect(updateUISpy).toHaveBeenCalledWith(log, true)
    })
  })

  describe("initialPairs()", () => {
    it("returns initial pairs", () => {
      const pairsMock = handMock.slice(0, 2)
      const pairs = game.initialPairs(handMock)
      expect(pairs).toStrictEqual(pairsMock)
    })
  })

  describe("playerTurn()", () => {
    const playerChosenCardEvent = {
      target: {
        id: "4_of_clubs",
      },
    } as any

    test("playerChosenCard set and playerTurnOutput() called", () => {
      game.player.hand = [...handMock]
      game.playerTurn(playerChosenCardEvent)
      expect(playerMatchSpy).toHaveBeenCalledOnce()
      expect(game.playerChosenCard).toBe(handMock[0])
    })
  })

  describe("opponentTurn()", () => {
    test("opponent chooses card from hand", () => {
      game.opponent.hand = [...handMock]
      game.opponentTurn()
      const log = `Do you have a ${game.opponentChosenCard?.value}?`
      expect(updateUISpy).toBeCalledWith(log, false, true)
    })
  })

  describe("playerTurnOutput()", () => {
    test("player matches with opponent", () => {
      game.playerChosenCard = handMock[0]
      game.player.hand = [handMock[0]]
      game.opponent.hand = [handMock[1]]

      game.playerTurnOutput()

      expect(game.player.pairs).toEqual([handMock[1], handMock[0]])
      expect(game.player.hand).toEqual([])
      expect(game.opponent.hand).toEqual([])
      expect(handleActionSpy).toBeCalledWith({
        type: Action.PLAYER_ACTION,
        playerOutput: PlayerOutput.OpponentMatch,
      })
      expect(updateUISpy).toBeCalledWith("", true)
      expect(game.playerChosenCard).toBeNull()
    })

    test("player does not matche with opponent", () => {
      game.playerChosenCard = handMock[0]
      game.player.hand = [handMock[0]]
      game.opponent.hand = [handMock[2]]

      game.playerTurnOutput()

      expect(updateUISpy).toBeCalledWith(
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck.",
        false,
        false,
        true
      )
      expect(game.playerChosenCard).toEqual(handMock[0])
    })
  })

  describe("playerResponse()", () => {
    test("player has matching card and responds with yes", () => {
      game.player.hand = handMock.slice(1)
      game.opponent.hand = [handMock[0]]
      game.opponentChosenCard = handMock[0]
      const hasCard = true
      game.playerResponse(hasCard)
      const log = "It's your opponent's turn again."

      expect(game.opponent.pairs).toEqual([handMock[0], handMock[1]])
      expect(game.opponent.hand).toEqual([])
      expect(game.player.hand).toEqual([handMock[2]])
      expect(updateUISpy).toBeCalledWith(log)
      expect(setOpponetTurnSpy).toHaveBeenCalledOnce()
    })

    test("player doesn't have matching card and responds with yes", () => {
      game.player.hand = [handMock[2]]
      game.opponent.hand = [handMock[0]]
      game.opponentChosenCard = handMock[0]
      const hasCard = true
      game.playerResponse(hasCard)
      const log = `Are you sure? Do you have a ${game.opponentChosenCard.value}?`

      expect(updateUISpy).toHaveBeenCalledWith(log, false, true)
    })

    test("player has matching card and responds with no", () => {
      game.player.hand = handMock.slice(1)
      game.opponent.hand = [handMock[0]]
      game.opponentChosenCard = handMock[0]
      const hasCard = false
      game.playerResponse(hasCard)
      const log = `Are you sure? Do you have a ${game.opponentChosenCard.value}?`

      expect(updateUISpy).toHaveBeenCalledWith(log, false, true)
    })

    test("player doesn't have matching card and responds with no", () => {
      game.player.hand = [handMock[2]]
      game.opponent.hand = [handMock[0]]
      game.opponentChosenCard = handMock[0]
      const hasCard = false
      game.playerResponse(hasCard)

      expect(opponentDealsSpy).toHaveBeenCalled()
    })
  })

  describe("playerDeals()", () => {
    test("correct methods are called for deck match", () => {
      playerDealsOutputSpy.mockReturnValue(PlayerOutput.DeckMatch)

      game.playerDeals()
      expect(playerDealsOutputSpy).toHaveBeenCalledOnce()
      expect(handleActionSpy).toBeCalledWith({
        type: Action.PLAYER_ACTION,
        playerOutput: PlayerOutput.DeckMatch,
      })
      expect(updateUISpy).toBeCalledWith("", true)
    })

    test("correct methods are called for hand match", () => {
      playerDealsOutputSpy.mockReturnValue(PlayerOutput.HandMatch)

      game.playerDeals()
      expect(playerDealsOutputSpy).toHaveBeenCalledOnce()
      expect(handleActionSpy).toBeCalledWith({
        type: Action.PLAYER_ACTION,
        playerOutput: PlayerOutput.HandMatch,
      })
      expect(opponentTurnSpy).toHaveBeenCalledOnce()
    })

    test("correct methods are called for no match", () => {
      playerDealsOutputSpy.mockReturnValue(PlayerOutput.NoMatch)

      game.playerDeals()
      expect(playerDealsOutputSpy).toHaveBeenCalledOnce()
      expect(handleActionSpy).toBeCalledWith({
        type: Action.PLAYER_ACTION,
        playerOutput: PlayerOutput.NoMatch,
      })
      expect(opponentTurnSpy).toHaveBeenCalledOnce()
    })
  })

  describe("playerDealsOutput()", () => {
    test("deck match", () => {
      dealFromDeckSpy.mockReturnValue(handMock[0])
      game.playerChosenCard = handMock[1]
      game.player.hand = [handMock[1]]

      const playerOutput = game.playerDealsOutput()
      expect(dealFromDeckSpy).toHaveBeenCalledOnce()
      expect(game.player.hand).toEqual([])
      expect(game.player.pairs).toEqual([handMock[0], handMock[1]])
      expect(playerOutput).toBe(PlayerOutput.DeckMatch)
    })

    test("hand match", () => {
      dealFromDeckSpy.mockReturnValue(handMock[0])
      game.playerChosenCard = handMock[2]
      game.player.hand = [handMock[1], handMock[2]]

      const playerOutput = game.playerDealsOutput()
      expect(dealFromDeckSpy).toHaveBeenCalledOnce()
      expect(game.player.hand).toEqual([handMock[2]])
      expect(game.player.pairs).toEqual([handMock[0], handMock[1]])
      expect(playerOutput).toBe(PlayerOutput.HandMatch)
    })

    test("no match", () => {
      dealFromDeckSpy.mockReturnValue(handMock[2])
      game.playerChosenCard = handMock[0]
      game.player.hand = [handMock[0]]

      const playerOutput = game.playerDealsOutput()
      expect(dealFromDeckSpy).toHaveBeenCalledOnce()
      expect(game.player.hand).toEqual([handMock[0], handMock[2]])
      expect(game.player.pairs).toEqual([])
      expect(playerOutput).toBe(PlayerOutput.NoMatch)
    })
  })

  describe("opponentDeals()", () => {
    test("opponent matches with dealt card", () => {
      dealFromDeckSpy.mockReturnValue(handMock[0])
      game.opponentChosenCard = handMock[1]
      game.opponent.hand = handMock.slice(1)
      const log =
        "Your opponent has dealt a card from the deck and matched with the dealt card. It's your opponent's turn again."

      game.opponentDeals()
      expect(game.opponent.pairs).toEqual([handMock[0], handMock[1]])
      expect(game.opponent.hand).toEqual([handMock[2]])
      expect(updateUISpy).toBeCalledWith(log)
      expect(setOpponetTurnSpy).toHaveBeenCalledOnce()
    })

    test("opponent has match in hand", () => {
      dealFromDeckSpy.mockReturnValue(handMock[0])
      game.opponentChosenCard = handMock[2]
      game.opponent.hand = handMock.slice(1)
      const log =
        "Your opponent has dealt a card from the deck. They didn't match with the dealt card but they had a hand match. It's your turn."

      game.opponentDeals()
      expect(game.opponent.pairs).toEqual([handMock[0], handMock[1]])
      expect(game.opponent.hand).toEqual([handMock[2]])
      expect(updateUISpy).toBeCalledWith(log, true)
    })

    test("opponent adds dealt card to hand", () => {
      dealFromDeckSpy.mockReturnValue(handMock[0])
      game.opponentChosenCard = handMock[2]
      game.opponent.hand = handMock.slice(2)
      const log =
        "Your opponent has dealt a card from the deck and added it to their hand. There were no matches. It's your turn."

      game.opponentDeals()
      expect(game.opponent.pairs).toEqual([])
      expect(game.opponent.hand).toEqual([handMock[2], handMock[0]])
      expect(updateUISpy).toBeCalledWith(log, true)
    })
  })

  describe("opponentTurn()", () => {
    test("random card is chosen from opponent hand and UI updates with card", () => {
      vi.spyOn(Math, "random").mockReturnValue(0)
      game.opponent.hand = handMock

      game.opponentTurn()
      const log = `Do you have a ${game.opponentChosenCard?.value}?`
      expect(game.opponentChosenCard).toEqual(handMock[0])
      expect(game.updateUI).toBeCalledWith(log, false, true)
    })
  })

  describe("updateUI()", () => {
    it("updates the UI correctly", () => {
      game.player.hand = [...handMock]
      game.opponent.hand = [...handMock]
      game.player.pairs = handMock.slice(0, 2)
      game.opponent.pairs = handMock.slice(0, 2)
      const log = "hello world"

      game.updateUI(log)

      expect(handleActionSpy).toBeCalledWith({
        type: Action.UPDATE,
        log,
        player: game.player,
        opponent: game.opponent,
        isPlayerTurn: false,
        isOpponentTurn: false,
        isDealFromDeck: false,
        deckCount: game.deck.length,
      })
      expect(gameOverSpy).toHaveBeenCalledOnce()
    })
  })

  describe("over()", () => {
    test("player hand empty", () => {
      game.player.hand = []
      game.opponent.hand = handMock
      game.deck = handMock
      game.over()
      expect(handleActionSpy).toHaveBeenCalledOnce()
    })

    test("opponent hand empty", () => {
      game.player.hand = handMock
      game.opponent.hand = []
      game.deck = handMock
      game.over()
      expect(handleActionSpy).toHaveBeenCalledOnce()
    })

    test("deck empty", () => {
      game.player.hand = handMock
      game.opponent.hand = handMock
      game.deck = []
      game.over()
      expect(handleActionSpy).toHaveBeenCalledOnce()
    })

    test("player wins", () => {
      game.deck = []
      game.player.pairs = handMock.slice(0, 2)
      game.opponent.pairs = []
      game.over()
      expect(handleActionSpy).toHaveBeenCalledWith({
        type: Action.GAME_OVER,
        log: "",
        outcome: Outcome.Player,
        deckCount: game.deck.length,
      })
    })

    test("opponent wins", () => {
      game.deck = []
      game.player.pairs = []
      game.opponent.pairs = handMock.slice(0, 2)
      game.over()
      expect(handleActionSpy).toHaveBeenCalledWith({
        type: Action.GAME_OVER,
        log: "",
        outcome: Outcome.Opponent,
        deckCount: game.deck.length,
      })
    })

    test("draw", () => {
      game.deck = []
      game.player.pairs = handMock.slice(0, 2)
      game.opponent.pairs = handMock.slice(0, 2)
      game.over()
      expect(handleActionSpy).toHaveBeenCalledWith({
        type: Action.GAME_OVER,
        log: "",
        outcome: Outcome.Draw,
        deckCount: game.deck.length,
      })
    })
  })
})
