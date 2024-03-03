import pairs from "./pairsFunctions"
import playerFunctions from "./playerFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { opponentDealtType, opponentTurnType } from "../types/function-types"
import { JSX } from "solid-js/jsx-runtime"
import { OpponentOutput } from "../types/enums"
import Opponent from "../gameObjects/Opponent"

export const opponentAsk = (opponent: Opponent) =>
  opponent.hand[Math.floor(Math.random() * opponent.hand.length)]

export const opponentDealt: opponentDealtType = (
  deck,
  player,
  opponent,
  opponentAsk
) => {
  const dealtCard = deck.dealCard()

  if (dealtCard) {
    if (dealtCard.value === opponentAsk.value) {
      opponent.pairs.push(dealtCard)
      opponent.pairs.push(opponentAsk)
      opponent.hand.splice(opponent.hand.indexOf(opponentAsk), 1)
      pairs.updateUI(deck, player, opponent)
      return OpponentOutput.DeckMatch
    }

    for (const card of opponent.hand) {
      if (dealtCard.value === card.value) {
        opponent.pairs.push(dealtCard)
        opponent.pairs.push(card)
        opponent.hand.splice(opponent.hand.indexOf(card), 1)
        pairs.updateUI(deck, player, opponent)
        return OpponentOutput.HandMatch
      }
    }

    opponent.hand.push(dealtCard)
    pairs.updateUI(deck, player, opponent)
    return OpponentOutput.NoMatch
  }
}

export const opponentTurn: opponentTurnType = (deck, player, opponent) => {
  const gameOverCheck = pairs.gameOver(deck, player, opponent)

  const playerHandUnclickable = true

  pairs.updateUI(deck, player, opponent, playerHandUnclickable)

  if (!gameOverCheck) {
    const chosenCard = opponentAsk(opponent)
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
      playerFunctions.playerResponseHandler(
        hasCard,
        deck,
        player,
        opponent,
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
