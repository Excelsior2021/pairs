import { beforeEach, describe, it, test, expect, vi } from "vitest"
import Player from "../../src/game-objects/player"
import Deck from "../../src/game-objects/deck"
import Opponent from "../../src/game-objects/opponent"
import Game from "../../src/game-objects/game"
import { suit } from "../../src/game-objects/card"
import { PlayerOutput } from "../../src/enums"

describe("player class", () => {
  let deck: Deck
  let player: Player
  let opponent: Opponent
  let game: Game
  const dispatchGameActionMock = vi.fn()

  beforeEach(() => {
    player = new Player(dispatchGameActionMock)
    opponent = new Opponent(dispatchGameActionMock)
    game = new Game(deck, player, opponent, dispatchGameActionMock)
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
