import { it, describe, expect, beforeEach, vi } from "vitest"
import Card from "../../src/game-objects/card"
import Deck from "../../src/game-objects/deck"
import Game from "../../src/game-objects/game"
import Player from "../../src/game-objects/player"
import Opponent from "../../src/game-objects/opponent"
import mockDeck from "../__mocks__/deck"

describe("deck class", () => {
  let deck: Deck
  let dispatchGameActionSpy = vi.fn()

  beforeEach(() => {
    dispatchGameActionSpy = vi.fn()
    deck = new Deck(Card, dispatchGameActionSpy)
  })

  describe(".create()", () => {
    it("returns a standard deck of cards", () => {
      const newDeck = deck.create(Card)
      expect(JSON.stringify(newDeck)).toBe(JSON.stringify(mockDeck))
    })
  })

  describe(".shuffle()", () => {
    it("shuffles deck", () => {
      const topCard = deck.deck[0]

      deck.shuffle()

      const newTopCard = deck.deck[0]

      expect(topCard).not.toEqual(newTopCard)
    })
  })

  describe(".dealCard()", () => {
    it("returns a card from deck", () => {
      const dealtCard = deck.dealCard()
      expect(dealtCard).toHaveProperty("id")
      expect(dealtCard).toHaveProperty("suit")
      expect(dealtCard).toHaveProperty("value")
      expect(dealtCard).toHaveProperty("img")
    })
  })

  describe(".dealHand()", () => {
    it("deals correct number of cards", () => {
      expect(deck.dealHand(7)).toHaveLength(7)
    })
  })

  describe(".handler()", () => {
    const player = new Player(dispatchGameActionSpy)
    const opponent = new Opponent(dispatchGameActionSpy)
    const game = new Game(deck, player, opponent, dispatchGameActionSpy)
    const playerSpy = vi.spyOn(player, "dealt")

    it("checks if player.dealt was called", () => {
      deck.handler(game, player, opponent)
      expect(playerSpy).toHaveBeenCalled()
    })
  })
})
