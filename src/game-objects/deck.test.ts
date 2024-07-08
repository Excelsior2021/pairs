import { it, describe, expect, beforeEach, vi } from "vitest"
import Card from "./card"
import Deck from "./deck"
import Game from "./game"
import Player from "./player"
import Opponent from "./opponent"
import { dispatchGameAction } from "../components/session/session"

describe("deck class", () => {
  let deck: Deck
  let dispatchGameActionSpy = vi.fn(dispatchGameAction)

  beforeEach(() => {
    dispatchGameActionSpy = vi.fn(dispatchGameAction)
    deck = new Deck(Card, dispatchGameActionSpy)
  })

  describe(".create()", () => {
    it("creates 52 cards of a standard deck", () => {
      const newDeck = deck.create()
      expect(newDeck).toHaveLength(52)
      expect(newDeck[0].id).toBe("ace_of_clubs")
      expect(newDeck[newDeck.length - 1].id).toBe("10_of_spades")
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
    it("deals a card from deck", () => {
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
