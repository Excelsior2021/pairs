import deck from "./deckFunctions"
import pairs from "./pairsFunctions"
import player from "./playerFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { opponentDealtType, opponentTurnType } from "../types/function-types"
import { JSX } from "solid-js/jsx-runtime"
import { Card } from "../store/classes"
import { OpponentOutput } from "../types/enums"

export const opponentAsk = (opponentHand: Card[]) =>
  opponentHand[Math.floor(Math.random() * opponentHand.length)]

export const opponentDealt: opponentDealtType = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsk
) => {
  const dealtCard = deck.dealCard(shuffledDeck)

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
      return OpponentOutput.DeckMatch
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
        return OpponentOutput.HandMatch
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
    return OpponentOutput.NoMatch
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
      <button class="game__button" onClick={() => playerResponseHandler(true)}>
        Yes
      </button>
    ) as JSX.Element
    const noButton = (
      <button class="game__button" onClick={() => playerResponseHandler(false)}>
        No
      </button>
    ) as JSX.Element

    const playerResponseHandler = (hasCard: boolean) =>
      player.playerResponseHandler(
        hasCard,
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        chosenCard,
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
  }
}

export default {
  opponentAsk,
  opponentDealt,
  opponentTurn,
}
