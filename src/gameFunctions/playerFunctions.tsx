import deckFunctions from "./deckFunctions"
import pairs from "./pairsFunctions"
import opponentFunctions from "./opponentFunctions"
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
  deck,
  player,
  opponent
) => {
  let chosenCard

  for (const card of player.hand) {
    if (card.id === playerHandEvent.target!.id) chosenCard = card
  }

  if (chosenCard) {
    for (const card of opponent.hand) {
      if (card.value === chosenCard.value) {
        player.pairs.push(card)
        opponent.hand.splice(opponent.hand.indexOf(card), 1)

        for (const card of player.hand) {
          if (playerHandEvent.target!.id === card.id) {
            player.pairs.push(card)
            player.hand.splice(player.hand.indexOf(card), 1)
            pairs.updateUI(deck, player, opponent)
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
  player,
  opponent
) => {
  const dealtCard = deck.dealCard()
  let chosenCard

  for (const card of player.hand) {
    if (card.id === playerHandEvent.target!.id) chosenCard = card
  }

  if (chosenCard && dealtCard) {
    if (chosenCard.value === dealtCard.value) {
      player.pairs.push(dealtCard)
      for (let card of player.hand) {
        if (chosenCard.id === card.id) {
          player.pairs.push(card)
          player.hand.splice(player.hand.indexOf(card), 1)
          pairs.updateUI(deck, player, opponent)
          return PlayerOutput.DeckMatch
        }
      }
    }

    for (const card of player.hand) {
      if (dealtCard.value === card.value) {
        player.pairs.push(dealtCard)
        player.pairs.push(card)
        player.hand.splice(player.hand.indexOf(card), 1)
        pairs.updateUI(deck, player, opponent)
        return PlayerOutput.HandMatch
      }
    }

    player.hand.push(dealtCard)
    pairs.updateUI(deck, player, opponent)
    return PlayerOutput.NoMatch
  }
}

export const playerTurnHandler: playerTurnHandlerType = (
  playerHandEvent,
  deck,
  player,
  opponent
) => {
  const gameDeckHandler = () =>
    deckFunctions.gameDeckHandler(playerHandEvent, deck, player, opponent)

  const playerOutput = playerMatch(playerHandEvent, deck, player, opponent)

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    player,
  })
  dispatchGameAction({ type: "GAME_LOG" })

  const gameOverCheck = pairs.gameOver(deck, player, opponent)

  if (!gameOverCheck) {
    if (playerOutput === PlayerOutput.NoOpponentMatch) {
      const log =
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck."

      const playerHandClickable = false
      pairs.updateUI(deck, player, opponent, playerHandClickable)
      deck.deckUI(gameDeckHandler)
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export const playerResponseHandler: playerResponseHandlerType = (
  hasCard,
  deck,
  player,
  opponent,
  opponentAsked,
  yesButton,
  noButton
) => {
  const opponentTurn = () =>
    opponentFunctions.opponentTurn(deck, player, opponent)

  let log

  if (hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentAsked.value) {
        opponent.pairs.push(opponentAsked)
        opponent.hand.splice(opponent.hand.indexOf(opponentAsked), 1)

        opponent.pairs.push(card)
        player.hand.splice(player.hand.indexOf(card), 1)

        const playerHandClickable = false
        pairs.updateUI(deck, player, opponent, playerHandClickable)
        opponentFunctions.opponentTurn(deck, player, opponent)
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
    for (const card of player.hand) {
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

    const opponentOutput = opponentFunctions.opponentDealt(
      deck,
      player,
      opponent,
      opponentAsked
    )

    if (opponentOutput === OpponentOutput.DeckMatch) {
      const playerHandClickable = false
      pairs.updateUI(deck, player, opponent, playerHandClickable)
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
