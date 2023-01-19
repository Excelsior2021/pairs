import pairs from "./pairsFunctions"
import opponent from "./opponentFunctions"
import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import {
  playerAnswerHandlerType,
  playerMatchType,
} from "../types/function-types"

export const playerMatch: playerMatchType = (
  playerHandEvent,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  shuffledDeck
) => {
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }

  if (chosenCard) {
    for (const card of opponentHand) {
      if (card.value === chosenCard.value) {
        playerPairs.push(card)
        opponentHand.splice(opponentHand.indexOf(card), 1)

        for (const card of playerHand) {
          if (playerHandEvent.target.id === card.id) {
            playerPairs.push(card)
            playerHand.splice(playerHand.indexOf(card), 1)
            pairs.updateUI(
              playerHand,
              opponentHand,
              playerPairs,
              opponentPairs,
              shuffledDeck
            )
            return 0
          }
        }
      }
    }
    return false
  }
}

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

export const playerAnswerHandler: playerAnswerHandlerType = (
  playerHandEvent,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsked
) => {
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }

  if (chosenCard) {
    if (chosenCard.value === opponentAsked.value) {
      opponent.opponentMatch(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        opponentAsked,
        playerHandEvent,
        shuffledDeck
      )
      opponent.opponentTurn(
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs
      )
    } else if (chosenCard.value !== opponentAsked.value) {
      const log = (
        <p class="game__log">
          That card does not have the value that your opponent requested. Please
          select the card with the value your opponent requested. Your opponent
          requested a {opponentAsked.value}.
        </p>
      )
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export default {
  playerMatch,
  playerTurnHandler,
  playerResponseHandler,
  playerAnswerHandler,
}
