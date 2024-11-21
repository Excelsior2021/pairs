import { test, it, describe, expect, beforeEach, vi } from "vitest"
import {
  playerResponseHandler,
  playerTurnHandler,
} from "@/multiplayer-event-functions"
import { GameAction } from "@/enums"

describe("multiplayer event functions", () => {
  const clientPlayer = 1
  const dispatchGameActionMock = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("playerTurnHandler()", () => {
    const card = { id: 1 }
    const playerHandEventMock = {
      target: {
        id: 1,
      },
    } as any
    const player = {
      hand: [card],
    } as any

    it("dispatches game action correctly", () => {
      playerTurnHandler(
        playerHandEventMock,
        player,
        clientPlayer,
        dispatchGameActionMock
      )

      expect(dispatchGameActionMock).toBeCalledWith({
        type: GameAction.PLAYER_REQUEST,
        playerRequest: {
          card,
          clientPlayer,
        },
      })
    })
  })

  describe("playerResponseHandler()", () => {
    describe("hasCard true", () => {
      const hasCard = true
      let card = { value: 1 }
      const opponentRequestMultiplayer = {
        card,
      } as any
      const player = {
        hand: [card],
      } as any

      let log = "It's your opponent's turn again."

      test("player match", () => {
        playerResponseHandler(
          hasCard,
          opponentRequestMultiplayer,
          player,
          clientPlayer,
          dispatchGameActionMock
        )

        expect(dispatchGameActionMock).toBeCalledWith({
          type: GameAction.PLAYER_MATCH,
          playerCard: { clientPlayer, card },
          opponentRequestMultiplayer,
          log,
        })
      })

      test("no match", () => {
        card = { value: 2 }
        log = `Are you sure? Do you have a ${card.value}?`
        const opponentRequestMultiplayer = {
          card,
        } as any
        playerResponseHandler(
          hasCard,
          opponentRequestMultiplayer,
          player,
          clientPlayer,
          dispatchGameActionMock
        )

        expect(dispatchGameActionMock).toBeCalledWith({
          type: GameAction.PLAYER_MATCH,
          log,
        })
      })
    })

    describe("hasCard false", () => {
      const hasCard = false
      let card = { value: 1 }
      const opponentRequestMultiplayer = {
        card,
      } as any
      const player = {
        hand: [card],
      } as any
      let log = `Are you sure? Do you have a ${card.value}?`

      test("player match", () => {
        playerResponseHandler(
          hasCard,
          opponentRequestMultiplayer,
          player,
          clientPlayer,
          dispatchGameActionMock
        )

        expect(dispatchGameActionMock).toBeCalledWith({
          type: GameAction.PLAYER_MATCH,
          log,
        })
      })

      test("no match", () => {
        card = { value: 2 }
        const opponentRequestMultiplayer = {
          card,
        } as any
        log = "Your opponent must now deal a card from the deck."
        playerResponseHandler(
          hasCard,
          opponentRequestMultiplayer,
          player,
          clientPlayer,
          dispatchGameActionMock
        )

        expect(dispatchGameActionMock).toBeCalledWith({
          type: GameAction.NO_PLAYER_MATCH,
          opponentRequestMultiplayer,
          log,
        })
      })
    })
  })
})
