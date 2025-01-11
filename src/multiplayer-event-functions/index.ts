import type {
  playerRequest,
  playerDeals as playerDealsType,
  playerDisconnects as playerDisconnectsType,
  playerResponse as playerResponseType,
  playerTurn as playerTurnType,
} from "@types"

export const playerTurn: playerTurnType = (
  chosenCard,
  player,
  playerID,
  dispatchAction,
  Action
) => {
  const eventTarget = chosenCard.target as HTMLImageElement

  if (player && eventTarget)
    for (const card of player.hand)
      if (card.id === eventTarget.id) {
        dispatchAction({
          type: Action.PLAYER_REQUEST,
          playerRequest: { card, playerID },
        })
        break
      }
}

export const playerResponse: playerResponseType = (
  hasCard,
  opponentRequest,
  player,
  playerID,
  dispatchAction,
  Action
) => {
  const { card: opponentRequestCard } = opponentRequest
  let log
  let playerCard: playerRequest

  if (hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        log = "It's your opponent's turn again."
        playerCard = { playerID, card }
        dispatchAction({
          type: Action.PLAYER_MATCH,
          playerCard,
          opponentRequest,
          log,
        })
        return
      }
    }
    log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
    dispatchAction({
      type: Action.PLAYER_MATCH,
      log,
    })
  } else {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
        dispatchAction({
          type: Action.PLAYER_MATCH,
          log,
        })
        return
      }
    }
    log = "Your opponent must now deal a card from the deck."
    dispatchAction({
      type: Action.NO_PLAYER_MATCH,
      opponentRequest,
      log,
    })
  }
}

export const playerDeals: playerDealsType = (
  playerRequest,
  dispatchAction,
  Action
) =>
  dispatchAction({
    type: Action.PLAYER_DEALT,
    playerRequest,
  })

export const playerDisconnects: playerDisconnectsType = (
  dispatchAction,
  Action
) => dispatchAction({ type: Action.PLAYER_DISCONNECT })
