import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"

export const playerTurnHandler = (playerHandEvent, playerHand) => {
  let chosenCard
  for (const card of playerHand) {
    if (card.id === playerHandEvent.currentTarget.id) chosenCard = card
  }
  dispatchGameAction({
    type: "PLAYER_REQUEST",
    playerRequest: chosenCard,
  })
}

export const playerResponseHandler = (
  response,
  opponentRequest,
  playerHand,
  player
) => {
  const { card: opponentRequestCard } = opponentRequest
  let log
  let playerCard

  if (response.currentTarget.value === "yes") {
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

  if (response.currentTarget.value === "no") {
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
