import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import Card from "../gameObjects/Card"
import {
  playerResponseHandlerMultiplayerType,
  playerTurnHandlerMultiplayerType,
} from "../types/function-types"
import { playerRequest } from "../types/general"

export const playerTurnHandler: playerTurnHandlerMultiplayerType = (
  playerHandEvent,
  player,
  clientPlayer
) => {
  let chosenCard: Card
  if (player && playerHandEvent.target)
    for (const card of player.hand)
      if (card.id === playerHandEvent.target.id) {
        chosenCard = card
        break
      }

  dispatchGameAction({
    type: "PLAYER_REQUEST",
    playerRequest: { card: chosenCard!, clientPlayer },
  })
}

export const playerResponseHandler: playerResponseHandlerMultiplayerType = (
  hasCard,
  opponentRequestMultiplayer,
  player,
  clientPlayer
) => {
  const { card: opponentRequestCard } = opponentRequestMultiplayer
  let log
  let playerCard: playerRequest

  if (hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        log = `It's your opponent's turn again.`
        playerCard = { clientPlayer, card }
        dispatchGameAction({
          type: "PLAYER_MATCH",
          playerCard,
          opponentRequestMultiplayer,
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
    for (const card of player.hand) {
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
    dispatchGameAction({
      type: "NO_PLAYER_MATCH",
      opponentRequestMultiplayer,
      log,
    })
  }
}

export default {
  playerTurnHandler,
  playerResponseHandler,
}
