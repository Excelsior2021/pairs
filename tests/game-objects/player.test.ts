import { beforeEach, describe, test, expect, vi } from "vitest"
import { Deck, Game, Player, Opponent } from "@game-objects"
import { suit } from "@enums"
import { PlayerOutput } from "@enums"

describe("player class", () => {
  let deck: Deck
  let player: Player
  let opponent: Opponent
  let game: Game
  const dispatchActionMock = vi.fn()

  beforeEach(() => {
    player = new Player(dispatchActionMock)
    opponent = new Opponent(dispatchActionMock)
    game = new Game(deck, player, opponent, dispatchActionMock)
  })

  describe(".match()", () => {
    beforeEach(() => {
      player.hand = [
        {
          id: "4_of_clubs",
          value: 4,
          suit: suit.clubs,
          img: "./cards/4_of_clubs.webp",
        },
      ]
      player.chosenCard = {
        id: "4_of_clubs",
        value: 4,
        suit: suit.clubs,
        img: "./cards/4_of_clubs.webp",
      }
    })

    test("player card matches with opponent card", () => {
      opponent.hand = [
        {
          id: "4_of_diamonds",
          value: 4,
          suit: suit.diamonds,
          img: "./cards/4_of_diamonds.webp",
        },
      ]
      expect(player.match(game, opponent)).toBe(PlayerOutput.OpponentMatch)
    })

    test("player card does not match with opponent card", () => {
      opponent.hand = [
        {
          id: "5_of_diamonds",
          value: 5,
          suit: suit.diamonds,
          img: "./cards/5_of_diamonds.webp",
        },
      ]
      expect(player.match(game, opponent)).toBe(PlayerOutput.NoOpponentMatch)
    })
  })
})
