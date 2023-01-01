import deck from "./deckFunctions"
import pairs from "./pairsFunctions"
import player from "./playerFunctions"

import { dispatchGameAction } from "../components/Session/Session"
import { card, playerHandEventType } from "../types/general"
import {
  opponentDealtType,
  opponentMatchType,
  opponentTurnType,
} from "../types/function-types"
import { JSX } from "solid-js/jsx-runtime"

export const opponentAsk = (opponentHand: card[]) =>
  opponentHand[Math.floor(Math.random() * opponentHand.length)]

export const opponentMatch: opponentMatchType = (
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsk,
  playerHandEvent,
  shuffledDeck
) => {
  opponentPairs.push(opponentAsk)
  opponentHand.splice(opponentHand.indexOf(opponentAsk), 1)

  for (const card of playerHand) {
    if (playerHandEvent.target.id === card.id) {
      opponentPairs.push(card)
      playerHand.splice(playerHand.indexOf(card), 1)
    }
  }

  const playerHandUnclickable = true
  pairs.updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    shuffledDeck,
    playerHandUnclickable
  )
  return
}

export const opponentDealt: opponentDealtType = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsk
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck)

  if (dealtCard) {
    if (dealtCard.value === opponentAsk.value) {
      opponentPairs.push(dealtCard)
      opponentPairs.push(opponentAsk)
      opponentHand.splice(opponentHand.indexOf(opponentAsk), 1)
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        shuffledDeck
      )
      return 0
    }

    for (const card of opponentHand) {
      if (dealtCard.value === card.value) {
        opponentPairs.push(dealtCard)
        opponentPairs.push(card)
        opponentHand.splice(opponentHand.indexOf(card), 1)
        pairs.updateUI(
          playerHand,
          opponentHand,
          playerPairs,
          opponentPairs,
          shuffledDeck
        )
        return 1
      }
    }

    opponentHand.push(dealtCard)
    pairs.updateUI(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      shuffledDeck
    )
    return 2
  }
}

export const opponentTurn: opponentTurnType = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  const gameOverCheck = pairs.gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs
  )

  const playerHandUnclickable = true

  pairs.updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    shuffledDeck,
    playerHandUnclickable
  )

  if (!gameOverCheck) {
    const chosenCard = opponentAsk(opponentHand)
    const question = (
      <p class="game__log">Do you have a {chosenCard.value}?</p>
    ) as JSX.Element
    const yesButton = (
      <button
        class="game__button"
        value="yes"
        onClick={response => playerResponseHandler(response)}>
        Yes
      </button>
    ) as JSX.Element
    const noButton = (
      <button
        class="game__button"
        value="no"
        onClick={response => playerResponseHandler(response)}>
        No
      </button>
    ) as JSX.Element

    const playerResponseHandler = (
      response: MouseEvent & {
        currentTarget: HTMLButtonElement
        target: Element
      }
    ) =>
      player.playerResponseHandler(
        response,
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        chosenCard,
        playerAnswerHandler,
        yesButton,
        noButton
      )

    dispatchGameAction({
      type: "GAME_LOG",
      chosenCard,
      question,
      yesButton,
      noButton,
    })

    const playerAnswerHandler = (playerHandEvent: playerHandEventType) =>
      player.playerAnswerHandler(
        playerHandEvent,
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        chosenCard
      )
  }
}

export default {
  opponentAsk,
  opponentMatch,
  opponentDealt,
  opponentTurn,
}
