import { it, describe, expect, beforeEach, vi } from "vitest"
import Card from "../../src/game-objects/card"
import Deck from "../../src/game-objects/deck"
import Game from "../../src/game-objects/game"
import Player from "../../src/game-objects/player"
import Opponent from "../../src/game-objects/opponent"
import mockDeck from "../__mocks__/deck"
import { GameAction, PlayerOutput } from "../../src/enums"

describe("Deck class", () => {
  let deck: Deck
  let dispatchGameActionMock = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    deck = new Deck(Card, dispatchGameActionMock)
  })

  describe("create()", () => {
    it("returns a standard deck of cards", () => {
      const newDeck = deck.create(Card)
      expect(JSON.stringify(newDeck)).toBe(JSON.stringify(mockDeck))
    })
  })

  describe("shuffle()", () => {
    it("returns shuffled deck", () => {
      deck.shuffle()
      expect(JSON.stringify(deck.deck)).not.toBe(JSON.stringify(mockDeck))
    })
  })

  describe("dealCard()", () => {
    it("returns a card from deck", () => {
      const dealtCard = deck.dealCard()
      expect(JSON.stringify(dealtCard)).toStrictEqual(
        JSON.stringify(mockDeck[mockDeck.length - 1])
      )
    })
  })

  describe("dealHand()", () => {
    it("deals correct number of cards", () => {
      expect(deck.dealHand(7)).toHaveLength(7)
    })
  })

  describe("handler()", () => {
    const player = new Player(dispatchGameActionMock)
    const opponent = new Opponent(dispatchGameActionMock)
    const game = new Game(deck, player, opponent, dispatchGameActionMock)

    let opponentSpy = vi.spyOn(opponent, "turn")

    let gameSpy = vi.spyOn(game, "end")

    it("checks internal methods was called with the correct arguments", () => {
      const playerSpy = vi
        .spyOn(player, "dealt")
        .mockReturnValueOnce(PlayerOutput.HandMatch)

      deck.handler(game, player, opponent)
      expect(playerSpy).toHaveBeenCalledWith(game, deck)
      expect(deck.dispatchGameAction).toHaveBeenCalledWith({
        type: GameAction.PLAYER_ACTION,
        playerOutput: PlayerOutput.HandMatch,
        player,
      })
      expect(opponentSpy).toHaveBeenCalledWith(game)
      expect(gameSpy).toHaveBeenCalled()
    })

    it("checks opponent.turn not called", () => {
      deck.handler(game, player, opponent)
      expect(opponentSpy).not.toHaveBeenCalled()
    })
  })
})
