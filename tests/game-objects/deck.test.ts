import { it, describe, expect, beforeEach, vi } from "vitest"
import { Deck, Game, Player, Opponent } from "@game-objects"
import mockDeck from "../__mocks__/deck"
import { GameAction, PlayerOutput } from "@enums"

describe("Deck class", () => {
  let deck: Deck
  let dispatchActionMock = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    deck = new Deck(mockDeck, dispatchActionMock)
  })

  describe("shuffle()", () => {
    it("returns shuffled deck", () => {
      deck.shuffle()
      expect(JSON.stringify(deck.deck)).not.toBe(JSON.stringify(mockDeck))
    })
  })

  describe("handler()", () => {
    const player = new Player(dispatchActionMock)
    const opponent = new Opponent(dispatchActionMock)
    const game = new Game(deck, player, opponent, dispatchActionMock)

    let opponentSpy = vi.spyOn(opponent, "turn")

    let gameSpy = vi.spyOn(game, "end")

    it("checks internal methods was called with the correct arguments", () => {
      const playerSpy = vi
        .spyOn(player, "dealt")
        .mockReturnValueOnce(PlayerOutput.HandMatch)

      deck.handler(game, player, opponent)
      expect(playerSpy).toHaveBeenCalledWith(game, deck)
      expect(deck.dispatchAction).toHaveBeenCalledWith({
        type: GameAction.PLAYER_ACTION,
        playerOutput: PlayerOutput.HandMatch,
        player,
      })
      expect(opponentSpy).toHaveBeenCalledWith(game)
      expect(gameSpy).toHaveBeenCalled()
    })

    it("checks opponent.turn not called", () => {
      deck.handler(game, player, opponent)
      expect(opponentSpy).not.toHaveBeenCalled()
    })
  })
})
