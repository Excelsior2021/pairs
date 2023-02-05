import deck from "./deckFunctions"
import pairs from "./pairsFunctions"
import opponent from "./opponentFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import {
  playerAnswerHandlerType,
  playerDealtType,
  playerMatchType,
  playerResponseHandlerType,
  playerTurnHandlerType,
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

export const playerDealt: playerDealtType = (
  playerHandEvent,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  const dealtCard = deck.dealCard(shuffledDeck)
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }

  if (chosenCard && dealtCard) {
    if (chosenCard.value === dealtCard.value) {
      playerPairs.push(dealtCard)
      for (let card of playerHand) {
        if (chosenCard.id === card.id) {
          playerPairs.push(card)
          playerHand.splice(playerHand.indexOf(card), 1)
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
    }

    for (let card of playerHand) {
      if (dealtCard.value === card.value) {
        playerPairs.push(dealtCard)
        playerPairs.push(card)
        playerHand.splice(playerHand.indexOf(card), 1)
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

    playerHand.push(dealtCard)
    pairs.updateUI(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      shuffledDeck
    )
    return 3
  }
}

export const playerTurnHandler: playerTurnHandlerType = (
  playerHandEvent,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  const gameDeckHandler = () =>
    deck.gameDeckHandler(
      playerHandEvent,
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )

  const playerOutput = playerMatch(
    playerHandEvent,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    shuffledDeck
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
    opponentPairs
  )

  if (!gameOverCheck) {
    if (playerOutput === false) {
      const log =
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck."

      const playerHandUnclickable = true
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        shuffledDeck,
        playerHandUnclickable
      )
      setGameDeck(deck.gameDeckUI(gameDeckHandler))
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export const playerResponseHandler: playerResponseHandlerType = (
  response,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsked,
  playerAnswerHandler,
  yesButton,
  noButton
) => {
  const opponentTurn = () =>
    opponent.opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )

  let log

  if (response.currentTarget.value === "yes") {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = `Please select the card with the value of ${opponentAsked.value}. Then it will be your opponent's turn again.`

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
    log = `Are you sure? Do you have a ${opponentAsked.value}?`

    dispatchGameAction({
      type: "GAME_LOG",
      yesButton,
      noButton,
      log,
    })
    return
  }

  if (response.currentTarget.value === "no") {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = `Are you sure? Do you have a ${opponentAsked.value}?`

        dispatchGameAction({
          type: "GAME_LOG",
          yesButton,
          noButton,
          log,
        })
        return
      }
    }

    const opponentOutput = opponent.opponentDealt(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      opponentAsked
    )

    if (opponentOutput === 0) {
      const playerHandUnclickable = true
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        shuffledDeck,
        playerHandUnclickable
      )
      log =
        "Your opponent has dealt a card from the deck and the value they chose matched with the dealt card's value. It's your opponent's turn again."

      dispatchGameAction({ type: "GAME_LOG", log })
      setTimeout(opponentTurn, 4000)
    }
    if (opponentOutput === 1) {
      log =
        "Your opponent has dealt a card from the deck. The value they chose did not match with the dealt card's value but they matched with another card in their deck. It's your turn."
    }
    if (opponentOutput === 2) {
      log =
        "Your opponent has dealt a card from the deck and added it to their hand. There were no matches. It's your turn."
    }
  }
  dispatchGameAction({ type: "GAME_LOG", log })
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
      const log =
        "That card does not have the value that your opponent requested. Please select the card with the value your opponent requested. Your opponent requested a {opponentAsked.value}."

      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
  playerAnswerHandler,
}
