import Deck from "./Deck"

describe("deck class", () => {
  let deck: Deck

  beforeEach(() => {
    deck = new Deck()
  })

  test("new deck create creates 52 cards", () => {
    deck = deck.create()
    expect(deck).toHaveLength(52)
    expect(deck[0].id).toBe("ace_of_clubs")
    expect(deck[deck.length - 1].id).toBe("10_of_spades")
  })

  test("shuffle, shuffles cards", () => {
    const card1PreShuffle = deck.deck[0]
    const card2PreShuffle = deck.deck[1]
    const card3PreShuffle = deck.deck[2]

    deck.shuffle()

    const card1PostShuffle = deck.deck[0]
    const card2PostShuffle = deck.deck[1]
    const card3PostShuffle = deck.deck[2]

    expect(card1PreShuffle).not.toEqual(card1PostShuffle)
    expect(card2PreShuffle).not.toEqual(card2PostShuffle)
    expect(card3PreShuffle).not.toEqual(card3PostShuffle)
  })

  test("dealCard from deck", () => {
    const dealtCard = deck.dealCard()
    expect(dealtCard).toHaveProperty("id")
    expect(dealtCard).toHaveProperty("suit")
    expect(dealtCard).toHaveProperty("value")
    expect(dealtCard).toHaveProperty("img")
  })

  test("dealHand deals correct number of cards", () => {
    expect(deck.dealHand(7)).toHaveLength(7)
  })
})
