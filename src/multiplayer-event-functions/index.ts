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
  GameAction
) => {
  const eventTarget = chosenCard.target as HTMLImageElement

  if (player && eventTarget)
    for (const card of player.hand)
      if (card.id === eventTarget.id) {
        dispatchAction({
          type: GameAction.PLAYER_REQUEST,
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
  GameAction
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
          type: GameAction.PLAYER_MATCH,
          playerCard,
          opponentRequest,
          log,
        })
        return
      }
    }
    log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
    dispatchAction({
      type: GameAction.PLAYER_MATCH,
      log,
    })
  } else {
    for (const card of player.hand) {
      if (card.value === opponentRequestCard.value) {
        log = `Are you sure? Do you have a ${opponentRequestCard.value}?`
        dispatchAction({
          type: GameAction.PLAYER_MATCH,
          log,
        })
        return
      }
    }
    log = "Your opponent must now deal a card from the deck."
    dispatchAction({
      type: GameAction.NO_PLAYER_MATCH,
      opponentRequest,
      log,
    })
  }
}

export const playerDeals: playerDealsType = (
  playerRequest,
  dispatchAction,
  GameAction
) =>
  dispatchAction({
    type: GameAction.PLAYER_DEALT,
    playerRequest,
  })

export const playerDisconnects: playerDisconnectsType = (
  dispatchAction,
  GameAction
) => dispatchAction({ type: GameAction.PLAYER_DISCONNECT })
