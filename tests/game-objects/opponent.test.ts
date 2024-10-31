import {
  beforeEach,
  describe,
  test,
  expect,
  vi,
  type MockInstance,
} from "vitest"
import { Card, Deck, Game, Player, Opponent } from "../../src/game-objects"
import { suit, OpponentOutput } from "../../src/enums"

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

describe("Opponent class", () => {
  let deck: Deck
  let player: Player
  let opponent: Opponent
  let game: Game
  const dispatchGameActionMock = vi.fn()

  beforeEach(() => {
    opponent = new Opponent(dispatchGameActionMock)
    opponent.hand = [...hand]
    game = new Game(deck, player, opponent, dispatchGameActionMock)
  })

  describe("ask()", () => {
    test("opponent requests a card", () => {
      const chosenCard = opponent.ask()
      expect(opponent.request).not.toBeNull()
      expect(chosenCard).toStrictEqual(opponent.request)
    })
  })

  describe("dealt()", () => {
    let updateUISpy: MockInstance
    let output: OpponentOutput

    beforeEach(() => {
      deck = new Deck(Card, dispatchGameActionMock)
      updateUISpy = vi.spyOn(game, "updateUI")
    })

    test("deck match", () => {
      vi.spyOn(deck, "dealCard").mockReturnValue(hand[0])
      opponent.request = hand[0]
      output = opponent.dealt(game, deck)!

      expect(output).toBe(OpponentOutput.DeckMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(2)
      expect(opponent.hand).toHaveLength(2)
    })

    test("hand match", () => {
      vi.spyOn(deck, "dealCard").mockReturnValue(hand[2])
      opponent.request = hand[0]
      output = opponent.dealt(game, deck)!

      expect(output).toBe(OpponentOutput.HandMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(2)
      expect(opponent.hand).toHaveLength(2)
    })

    test("no match", () => {
      vi.spyOn(deck, "dealCard").mockReturnValue({
        id: "7_of_diamonds",
        value: 7,
        suit: suit.diamonds,
        img: "./cards/7_of_diamonds.webp",
      })
      opponent.request = hand[0]
      output = opponent.dealt(game, deck)!

      expect(output).toBe(OpponentOutput.NoMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(0)
      expect(opponent.hand).toHaveLength(4)
    })
  })
})
