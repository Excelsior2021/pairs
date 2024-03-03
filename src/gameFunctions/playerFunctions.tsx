import deckFunctions from "./deckFunctions"
import pairs from "./pairsFunctions"
import opponent from "./opponentFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import {
  playerDealtType,
  playerMatchType,
  playerResponseHandlerType,
  playerTurnHandlerType,
} from "../types/function-types"
import { OpponentOutput, PlayerOutput } from "../types/enums"

export const playerMatch: playerMatchType = (
  playerHandEvent,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  deck
) => {
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target!.id) chosenCard = card
  }

  if (chosenCard) {
    for (const card of opponentHand) {
      if (card.value === chosenCard.value) {
        playerPairs.push(card)
        opponentHand.splice(opponentHand.indexOf(card), 1)

        for (const card of playerHand) {
          if (playerHandEvent.target!.id === card.id) {
            playerPairs.push(card)
            playerHand.splice(playerHand.indexOf(card), 1)
            pairs.updateUI(
              playerHand,
              opponentHand,
              playerPairs,
              opponentPairs,
              deck
            )
            return PlayerOutput.OpponentMatch
          }
        }
      }
    }
    return PlayerOutput.NoOpponentMatch
  }
}

export const playerDealt: playerDealtType = (
  playerHandEvent,
  deck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  const dealtCard = deck.dealCard()
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target!.id) chosenCard = card
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
            deck
          )
          return PlayerOutput.DeckMatch
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
          deck
        )
        return PlayerOutput.HandMatch
      }
    }

    playerHand.push(dealtCard)
    pairs.updateUI(playerHand, opponentHand, playerPairs, opponentPairs, deck)
    return PlayerOutput.NoMatch
  }
}

export const playerTurnHandler: playerTurnHandlerType = (
  playerHandEvent,
  deck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  const gameDeckHandler = () =>
    deckFunctions.gameDeckHandler(
      playerHandEvent,
      deck,
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
    deck
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    playerHand,
    playerPairs,
  })
  dispatchGameAction({ type: "GAME_LOG" })

  const gameOverCheck = pairs.gameOver(
    deck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs
  )

  if (!gameOverCheck) {
    if (playerOutput === PlayerOutput.NoOpponentMatch) {
      const log =
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck."

      const playerHandUnclickable = true
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        deck,
        playerHandUnclickable
      )
      setGameDeck(deckFunctions.gameDeckUI(gameDeckHandler))
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export const playerResponseHandler: playerResponseHandlerType = (
  hasCard,
  deck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsked,
  yesButton,
  noButton
) => {
  const opponentTurn = () =>
    opponent.opponentTurn(
      deck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )

  let log

  if (hasCard) {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        opponentPairs.push(opponentAsked)
        opponentHand.splice(opponentHand.indexOf(opponentAsked), 1)

        opponentPairs.push(card)
        playerHand.splice(playerHand.indexOf(card), 1)

        const playerHandUnclickable = true
        pairs.updateUI(
          playerHand,
          opponentHand,
          playerPairs,
          opponentPairs,
          deck,
          playerHandUnclickable
        )
        opponent.opponentTurn(
          deck,
          playerHand,
          opponentHand,
          playerPairs,
          opponentPairs
        )
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

  if (!hasCard) {
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
      deck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      opponentAsked
    )

    if (opponentOutput === OpponentOutput.DeckMatch) {
      const playerHandUnclickable = true
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        deck,
        playerHandUnclickable
      )
      log =
        "Your opponent has dealt a card from the deck and matched with the dealt card. It's your opponent's turn again."

      dispatchGameAction({ type: "GAME_LOG", log })
      setTimeout(opponentTurn, 4000)
    }
    if (opponentOutput === OpponentOutput.HandMatch) {
      log =
        "Your opponent has dealt a card from the deck. They didn't match with the dealt card but they matched with another card in their hand. It's your turn."
    }
    if (opponentOutput === OpponentOutput.NoMatch) {
      log =
        "Your opponent has dealt a card from the deck and added it to their hand. There were no matches. It's your turn."
    }
  }
  dispatchGameAction({ type: "GAME_LOG", log })
}

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
}
