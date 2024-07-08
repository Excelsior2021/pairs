import { beforeEach, describe, it, test, expect, vi } from "vitest"
import Opponent from "./opponent"
import Deck from "./deck"
import Game from "./game"
import Player from "./player"
import { OpponentOutput } from "../enums"
import Card, { suit } from "./card"

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

describe("opponent class", () => {
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

  describe(".ask()", () => {
    test("opponent requests a card", () => {
      const chosenCard = opponent.ask()
      expect(opponent.request).not.toBeNull()
      expect(chosenCard).toStrictEqual(opponent.request)
    })
  })

  describe(".dealt()", () => {
    beforeEach(() => {
      deck = new Deck(Card, dispatchGameActionMock)
    })

    it("matches requested card", () => {
      opponent.request = hand[0]
      vi.spyOn(deck, "dealCard").mockReturnValue(hand[0])
      const updateUISpy = vi.spyOn(game, "updateUI")

      expect(opponent.dealt(game, deck)).toBe(OpponentOutput.DeckMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(2)
      expect(opponent.hand).toHaveLength(2)
    })

    it("matches card in hand", () => {
      opponent.request = hand[1]

      vi.spyOn(deck, "dealCard").mockReturnValue(hand[2])
      const updateUISpy = vi.spyOn(game, "updateUI")

      expect(opponent.dealt(game, deck)).toBe(OpponentOutput.HandMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(2)
      expect(opponent.hand).toHaveLength(2)
    })

    it("has no matches", () => {
      opponent.request = hand[0]

      vi.spyOn(deck, "dealCard").mockReturnValue({
        id: "7_of_diamonds",
        value: 7,
        suit: suit.diamonds,
        img: "./cards/7_of_diamonds.webp",
      })
      const updateUISpy = vi.spyOn(game, "updateUI")

      expect(opponent.dealt(game, deck)).toBe(OpponentOutput.NoMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(0)
      expect(opponent.hand).toHaveLength(4)
    })
  })
})
