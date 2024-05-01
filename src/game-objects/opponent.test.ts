import { beforeEach, describe, test, expect, vi } from "vitest"
import Opponent from "./opponent"
import Deck from "./deck"
import Game from "./game"
import Player from "./player"
import { OpponentOutput } from "../types/enums"
import { suit } from "./card"

const hand = [
  {
    id: "4_of_clubs",
    value: 4,
    suit: suit.clubs,
    img: "./cards/4_of_clubs.png",
  },
  {
    id: "4_of_diamonds",
    value: 4,
    suit: suit.diamonds,
    img: "./cards/4_of_diamonds.png",
  },
  {
    id: "8_of_diamonds",
    value: 8,
    suit: suit.diamonds,
    img: "./cards/8_of_diamonds.png",
  },
]

describe("opponent class", () => {
  let opponent: Opponent
  let game: Game
  let player: Player
  const playerTurnHandler = vi.fn()
  const dispatchGameAction = vi.fn()

  beforeEach(() => {
    opponent = new Opponent()
    opponent.hand = [...hand]
    game = new Game()
  })

  test(".ask()", () => {
    const chosenCard = opponent.ask()
    expect(chosenCard).toHaveProperty("id")
    expect(chosenCard).toHaveProperty("suit")
    expect(chosenCard).toHaveProperty("value")
    expect(chosenCard).toHaveProperty("img")
    expect(chosenCard).toStrictEqual(opponent.request)
  })

  test(".dealt() to match request card", () => {
    opponent.request = hand[0]
    const deck = new Deck()
    vi.spyOn(deck, "dealCard").mockReturnValue(hand[0])
    const updateUISpy = vi.spyOn(game, "updateUI")

    expect(opponent.dealt(game, deck, player, dispatchGameAction)).toBe(
      OpponentOutput.DeckMatch
    )
    expect(updateUISpy).toHaveBeenCalled()
    expect(opponent.pairs).toHaveLength(2)
    expect(opponent.hand).toHaveLength(2)
  })

  test(".dealt() to match card in hand", () => {
    opponent.request = hand[1]
    const deck = new Deck()
    vi.spyOn(deck, "dealCard").mockReturnValue(hand[2])
    const updateUISpy = vi.spyOn(game, "updateUI")

    expect(opponent.dealt(game, deck, player, dispatchGameAction)).toBe(
      OpponentOutput.HandMatch
    )
    expect(updateUISpy).toHaveBeenCalled()
    expect(opponent.pairs).toHaveLength(2)
    expect(opponent.hand).toHaveLength(2)
  })

  test(".dealt() to have no match", () => {
    opponent.request = hand[0]
    const deck = new Deck()
    vi.spyOn(deck, "dealCard").mockReturnValue({
      id: "7_of_diamonds",
      value: 7,
      suit: "diamonds",
      img: "./cards/7_of_diamonds.png",
    })
    const updateUISpy = vi.spyOn(game, "updateUI")

    expect(opponent.dealt(game, deck, player, dispatchGameAction)).toBe(
      OpponentOutput.NoMatch
    )
    expect(updateUISpy).toHaveBeenCalled()
    expect(opponent.pairs).toHaveLength(0)
    expect(opponent.hand).toHaveLength(4)
  })
})
