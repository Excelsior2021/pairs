import {
  beforeEach,
  describe,
  test,
  expect,
  vi,
  type MockInstance,
} from "vitest"
import { Deck, Game, Player, Opponent } from "@game-objects"
import { OpponentOutput } from "@enums"
import { card } from "@types"

const deckMock = [
  {
    id: "4_of_clubs",
    value: 4,
    suit: "clubs",
    img: "./cards/4_of_clubs.webp",
  },
  {
    id: "4_of_diamonds",
    value: 4,
    suit: "diamonds",
    img: "./cards/4_of_diamonds.webp",
  },
  {
    id: "king_of_diamonds",
    value: "king",
    suit: "diamonds",
    img: "./cards/king_of_diamonds.webp",
  },
  {
    id: "6_of_hearts",
    value: 6,
    suit: "hearts",
    img: "./cards/6_of_hearts.webp",
  },
  {
    id: "8_of_spades",
    value: 8,
    suit: "spades",
    img: "./cards/8_of_spades.webp",
  },
] as card[]

const handMock = [
  {
    id: "4_of_spades",
    value: 4,
    suit: "spades",
    img: "./cards/4_of_spades.webp",
  },
  {
    id: "7_of_spades",
    value: 7,
    suit: "spades",
    img: "./cards/7_of_spades.webp",
  },
  {
    id: "8_of_diamonds",
    value: 8,
    suit: "diamonds",
    img: "./cards/8_of_diamonds.webp",
  },
] as card[]

describe("Opponent class", () => {
  let deck: Deck
  let player: Player
  let opponent: Opponent
  let game: Game
  const dispatchActionMock = vi.fn()

  beforeEach(() => {
    opponent = new Opponent(dispatchActionMock)
    opponent.hand = [...handMock]
    game = new Game(deck, player, opponent, dispatchActionMock)
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
      deck = new Deck(deckMock, dispatchActionMock)
      updateUISpy = vi.spyOn(game, "updateUI")
    })

    test("deck match", () => {
      opponent.request = handMock[handMock.length - 1]
      output = opponent.dealt(game, deck)!

      expect(output).toBe(OpponentOutput.DeckMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(2)
      expect(opponent.hand).toHaveLength(2)
    })

    test("hand match", () => {
      opponent.request = handMock[0]
      output = opponent.dealt(game, deck)!

      expect(output).toBe(OpponentOutput.HandMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(2)
      expect(opponent.hand).toHaveLength(2)
    })

    test("no match", () => {
      opponent.request = handMock[0]
      deck.deck[deck.deck.length - 1] = {
        id: "3_of_clubs",
        value: 3,
        suit: "clubs",
        img: "./cards/3_of_clubs.webp",
      } as card
      output = opponent.dealt(game, deck)!

      expect(output).toBe(OpponentOutput.NoMatch)
      expect(updateUISpy).toHaveBeenCalled()
      expect(opponent.pairs).toHaveLength(0)
      expect(opponent.hand).toHaveLength(4)
    })
  })
})
