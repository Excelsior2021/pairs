import { test, describe, expect, beforeEach, afterEach } from "vitest"
import Deck from "./Deck"

describe("deck class", () => {
  let deck: Deck

  beforeEach(() => {
    deck = new Deck()
  })

  test("`.create()` creates 52 cards of a standard deck", () => {
    const newDeck = deck.create()
    expect(newDeck).toHaveLength(52)
    expect(newDeck[0].id).toBe("ace_of_clubs")
    expect(newDeck[newDeck.length - 1].id).toBe("10_of_spades")
  })

  test("`.shuffle()` shuffles cards", () => {
    const randomNum = Math.floor(Math.random() * 52)

    const card1PreShuffle = deck.deck[randomNum]

    deck.shuffle()

    const card1PostShuffle = deck.deck[randomNum]

    expect(card1PreShuffle).not.toEqual(card1PostShuffle)
  })

  test("`dealCard()` deals a card from deck", () => {
    const dealtCard = deck.dealCard()
    expect(dealtCard).toHaveProperty("id")
    expect(dealtCard).toHaveProperty("suit")
    expect(dealtCard).toHaveProperty("value")
    expect(dealtCard).toHaveProperty("img")
    expect(dealtCard).toBe
  })

  test("`dealHand()` deals correct number of cards", () => {
    expect(deck.dealHand(7)).toHaveLength(7)
  })
})
