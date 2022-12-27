import deck from "./deckFunctions"
import pairs from "./pairsFunctions"
import player from "./playerFunctions"
import { dispatchGameAction } from "../components/Session/Session"

export const opponentAsk = opponentHand =>
  opponentHand[Math.floor(Math.random() * opponentHand.length)]

export const opponentMatch = (
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

//If value of chosen card not in playerHand
export const opponentDealt = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsk
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck)

  //opponent matches with dealt card
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

  //opponent matches dealt card with another card in opponent hand
  for (let x in opponentHand) {
    if (dealtCard.value === opponentHand[x].value) {
      opponentPairs.push(dealtCard)
      opponentPairs.push(opponentHand[x])
      opponentHand.splice(opponentHand.indexOf(opponentHand[x]), 1)
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

  //opponent adds dealt card to opponent hand
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

export const opponentTurn = (
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
    const question = <p class="game__log">Do you have a {chosenCard.value}?</p>
    const yesButton = (
      <button
        class="game__button"
        value="yes"
        onClick={response => playerResponseHandler(response)}>
        Yes
      </button>
    )
    const noButton = (
      <button
        class="game__button"
        value="no"
        onClick={response => playerResponseHandler(response)}>
        No
      </button>
    )

    const playerResponseHandler = response =>
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

    const playerAnswerHandler = playerHandEvent =>
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
