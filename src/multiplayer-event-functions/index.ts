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
          action: GameAction.PLAYER_REQUEST,
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
          action: GameAction.PLAYER_MATCH,
          playerCard,
          opponentRequestMultiplayer,
          log,
        })
        return
      }
    }
    log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
    dispatchGameAction({
      action: GameAction.PLAYER_MATCH,
      log,
    })
  } else {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
        dispatchGameAction({
          action: GameAction.PLAYER_MATCH,
          log,
        })
        return
      }
    }
    log = "Your opponent must now deal a card from the deck."
    dispatchGameAction({
      action: GameAction.NO_PLAYER_MATCH,
      opponentRequestMultiplayer,
      log,
    })
  }
}

export default {
  playerTurnHandler,
  playerResponseHandler,
}
