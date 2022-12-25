import deck from "./deckFunctions"
import pairs from "./pairsFunctions"
import opponent from "./opponentFunctions"
import { card } from "../types/types"

export const playerMatch = (
  cardImg,
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler,
  updateUI
) => {
  const chosenCardValue = cardImg.target.value

  for (const card of opponentHand) {
    if (card.value === chosenCardValue) {
      playerPairs.push(card)
      opponentHand.splice(opponentHand.indexOf(card), 1)

      for (const card of playerHand) {
        if (cardImg.target.id === card.id) {
          playerPairs.push(card)
          playerHand.splice(playerHand.indexOf(card), 1)
          updateUI(
            playerHand,
            opponentHand,
            playerPairs,
            opponentPairs,
            playerTurnHandler
          )
          return 0
        }
      }
    }
  }
  return false
}

export const playerDealt = (
  cardImg,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler,
  updateUI
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck)
  const chosenCardValue = cardImg.target.value

  if (dealtCard) {
    if (chosenCardValue === dealtCard.value) {
      playerPairs.push(dealtCard)
      for (let card of playerHand) {
        if (cardImg.target.id === card.id) {
          playerPairs.push(card)
          playerHand.splice(playerHand.indexOf(card), 1)
          updateUI(
            playerHand,
            opponentHand,
            playerPairs,
            opponentPairs,
            playerTurnHandler
          )
          return 1
        }
      }
    }

    for (let card of playerHand) {
      if (dealtCard.value === card.value) {
        playerPairs.push(dealtCard)
        playerPairs.push(card)
        playerHand.splice(playerHand.indexOf(card), 1)
        updateUI(
          playerHand,
          opponentHand,
          playerPairs,
          opponentPairs,
          playerTurnHandler
        )
        return 2
      }
    }

    playerHand.push(dealtCard)
    updateUI(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler
    )
    return 3
  }
}

export const playerTurnHandler = (
  cardImg,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler,
  updateUI,
  dispatchGameAction,
  setGameDeck,
  opponentTurn
) => {
  const gameDeckHandler = () =>
    deck.gameDeckHandler(
      playerDealt,
      cardImg,
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction,
      setGameDeck,
      opponentTurn
    )

  let playerOutput = playerMatch(
    cardImg,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    updateUI
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    playerHand,
    playerPairs,
  })
  dispatchGameAction({ type: "GAME_LOG" })

  const gameOverCheck = pairs.gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    updateUI,
    dispatchGameAction
  )

  if (!gameOverCheck) {
    if (playerOutput === false) {
      const log = (
        <p class="game__log">
          You didn't match with any card in your opponent's hand. Please deal a
          card from the deck.
        </p>
      )
      pairs.playerHandUnclickable(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        playerTurnHandler,
        updateUI
      )
      setGameDeck(deck.gameDeckUI(gameDeckHandler))
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export const playerResponseHandler = (
  response,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked,
  playerAnswerHandler,
  playerTurnHandler,
  opponentDealt,
  yesButton,
  noButton,
  updateUI,
  dispatchGameAction
) => {
  const opponentTurn = () =>
    opponent.opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction
    )

  let log

  if (response.target.value === "yes") {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = (
          <p class="game__log">
            Please select the card with the same value as the one your opponent
            requested. Then it will be your opponent's turn again.
          </p>
        )
        dispatchGameAction({ type: "GAME_LOG", log })
        dispatchGameAction({
          type: "PLAYER_ANSWER",
          playerHand,
          opponentAsked,
          playerAnswerHandler,
        })
        return
      }
    }
    log = (
      <p class="game__log">
        Are you sure? Do you have a {opponentAsked.value}?
      </p>
    )
    dispatchGameAction({
      type: "GAME_LOG",
      yesButton,
      noButton,
      log,
    })
    return
  }
  if (response.target.value === "no") {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = (
          <p class="game__log">
            Are you sure? Do you have a {opponentAsked.value}?
          </p>
        )
        dispatchGameAction({
          type: "GAME_LOG",
          yesButton,
          noButton,
          log,
        })
        return
      }
    }

    const opponentOutput = opponentDealt(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      opponentAsked
    )
    if (opponentOutput === 0) {
      pairs.playerHandUnclickable(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        playerTurnHandler,
        updateUI
      )
      log = (
        <p class="game__log">
          Your opponent has dealt a card from the deck and the value they chose
          matched with the dealt card's value. It's your opponent's turn again.
        </p>
      )
      dispatchGameAction({ type: "GAME_LOG", log })
      setTimeout(opponentTurn, 4000)
    }
    if (opponentOutput === 1) {
      log = (
        <p class="game__log">
          Your opponent has dealt a card from the deck. The value they chose did
          not match with the dealt card's value but they matched with another
          card in their deck. It's your turn.
        </p>
      )
    }
    if (opponentOutput === 2) {
      log = (
        <p class="game__log">
          Your opponent has dealt a card from the deck and added it to their
          hand. There were no matches. It's your turn.
        </p>
      )
    }
  }
  dispatchGameAction({ type: "GAME_LOG", log })
}

export const playerAnswerHandler = (
  cardImg,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked,
  playerTurnHandler,
  opponentMatch,
  opponentTurn,
  updateUI,
  dispatchGameAction
) => {
  const chosenCard = cardImg.target

  if (chosenCard.value === opponentAsked.value) {
    opponentMatch(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      opponentAsked,
      cardImg
    )
    opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction
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

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
  playerAnswerHandler,
}
