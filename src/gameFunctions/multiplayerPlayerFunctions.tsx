import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import {
  playerResponseHandlerMultiplayerType,
  playerTurnHandlerMultiplayerType,
} from "../types/function-types"
import { card } from "../types/general"

export const playerTurnHandler: playerTurnHandlerMultiplayerType = (
  playerHandEvent,
  playerHand,
  player
) => {
  let chosenCard: card
  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }
  dispatchGameAction({
    type: "PLAYER_REQUEST",
    playerRequest: { card: chosenCard!, player },
  })
}

export const playerResponseHandler: playerResponseHandlerMultiplayerType = (
  hasCard,
  opponentRequest,
  playerHand,
  player
) => {
  const { card: opponentRequestCard } = opponentRequest
  let log
  let playerCard: { player: string; card: card }

  if (hasCard) {
    for (const card of playerHand) {
      if (card.value === opponentRequestCard.value) {
        log = `It's your opponent's turn again.`
        playerCard = { player, card }
        dispatchGameAction({
          type: "PLAYER_MATCH",
          playerCard,
          opponentRequest,
          log,
        })
        return
      }
    }
    log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
    dispatchGameAction({
      type: "PLAYER_MATCH",
      log,
    })
    return
  }

  if (!hasCard) {
    for (const card of playerHand) {
      if (card.value === opponentRequestCard.value) {
        const log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
        dispatchGameAction({
          type: "PLAYER_MATCH",
          log,
        })
        return
      }
    }
    const log = "Your opponent must now deal a card from the deck."
    dispatchGameAction({ type: "NO_PLAYER_MATCH", opponentRequest, log })
  }
}

export default {
  playerTurnHandler,
  playerResponseHandler,
}
