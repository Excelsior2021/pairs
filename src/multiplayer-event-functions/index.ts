import { GameAction } from "@enums"
import type {
  playerRequest,
  playerResponseHandlerMultiplayerType,
  playerTurnHandlerMultiplayerType,
} from "@types"

export const playerTurnHandler: playerTurnHandlerMultiplayerType = (
  playerHandEvent,
  player,
  clientPlayer,
  dispatchGameAction
) => {
  const eventTarget = playerHandEvent.target as HTMLImageElement

  if (player && eventTarget)
    for (const card of player.hand)
      if (card.id === eventTarget.id) {
        dispatchGameAction({
          type: GameAction.PLAYER_REQUEST,
          playerRequest: { card, clientPlayer },
        })
        break
      }
}

export const playerResponseHandler: playerResponseHandlerMultiplayerType = (
  hasCard,
  opponentRequestMultiplayer,
  player,
  clientPlayer,
  dispatchGameAction
) => {
  const { card: opponentRequestCard } = opponentRequestMultiplayer
  let log
  let playerCard: playerRequest

  if (hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        log = "It's your opponent's turn again."
        playerCard = { clientPlayer, card }
        dispatchGameAction({
          type: GameAction.PLAYER_MATCH,
          playerCard,
          opponentRequestMultiplayer,
          log,
        })
        return
      }
    }
    log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
    dispatchGameAction({
      type: GameAction.PLAYER_MATCH,
      log,
    })
    return
  }

  if (!hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        const log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
        dispatchGameAction({
          type: GameAction.PLAYER_MATCH,
          log,
        })
        return
      }
    }
    const log = "Your opponent must now deal a card from the deck."
    dispatchGameAction({
      type: GameAction.NO_PLAYER_MATCH,
      opponentRequestMultiplayer,
      log,
    })
  }
}

export default {
  playerTurnHandler,
  playerResponseHandler,
}
