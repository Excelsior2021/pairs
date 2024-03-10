import Deck from "./Deck"

test("deck create creates 52 cards", () => {
  const deck = new Deck().create()
  expect(deck).toHaveLength(52)
  expect(deck[0].id).toBe("ace_of_clubs")
  expect(deck[deck.length - 1].id).toBe("10_of_spades")
})

test("deal card from deck", () => {
  const deck = new Deck()
  expect(deck.dealCard().id).toBe("10_of_spades")
})
