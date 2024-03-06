import deckFunctions from "./deckFunctions"
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
  game,
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
            game.updateUI(
              deck,
              player,
              opponent,
              playerTurnHandler,
              dispatchGameAction,
              true
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
  game,
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
          game.updateUI(
            deck,
            player,
            opponent,
            playerTurnHandler,
            dispatchGameAction,
            true
          )
          return PlayerOutput.DeckMatch
        }
      }
    }

    for (const card of player.hand) {
      if (dealtCard.value === card.value) {
        player.pairs.push(dealtCard)
        player.pairs.push(card)
        player.hand.splice(player.hand.indexOf(card), 1)
        game.updateUI(
          deck,
          player,
          opponent,
          playerTurnHandler,
          dispatchGameAction
        )
        return PlayerOutput.HandMatch
      }
    }

    player.hand.push(dealtCard)
    game.updateUI(deck, player, opponent, playerTurnHandler, dispatchGameAction)
    return PlayerOutput.NoMatch
  }
}

export const playerTurnHandler: playerTurnHandlerType = (
  playerHandEvent,
  game,
  deck,
  player,
  opponent
) => {
  const gameDeckHandler = () =>
    deckFunctions.gameDeckHandler(playerHandEvent, game, deck, player, opponent)

  const playerOutput = playerMatch(
    playerHandEvent,
    game,
    deck,
    player,
    opponent
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    player,
  })
  dispatchGameAction({ type: "GAME_LOG" })

  const gameOverCheck = game.end(
    deck,
    player,
    opponent,
    playerTurnHandler,
    dispatchGameAction
  )

  if (!gameOverCheck) {
    if (playerOutput === PlayerOutput.NoOpponentMatch) {
      const log =
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck."
      game.updateUI(
        deck,
        player,
        opponent,
        playerTurnHandler,
        dispatchGameAction
      )
      setGameDeck(deckFunctions.gameDeckUI(gameDeckHandler))
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export const playerResponseHandler: playerResponseHandlerType = (
  hasCard,
  game,
  deck,
  player,
  opponent,
  opponentAsked,
  yesButton,
  noButton
) => {
  const opponentTurn = () =>
    opponent.turn(
      game,
      deck,
      player,
      playerTurnHandler,
      playerResponseHandler,
      dispatchGameAction
    )

  let log

  if (hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentAsked.value) {
        opponent.pairs.push(opponentAsked)
        opponent.hand.splice(opponent.hand.indexOf(opponentAsked), 1)

        opponent.pairs.push(card)
        player.hand.splice(player.hand.indexOf(card), 1)

        game.updateUI(
          deck,
          player,
          opponent,
          playerTurnHandler,
          dispatchGameAction
        )
        opponent.turn(
          game,
          deck,
          player,
          playerTurnHandler,
          playerResponseHandler,
          dispatchGameAction
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

    const opponentOutput = opponent.dealt(
      game,
      deck,
      player,
      playerTurnHandler,
      dispatchGameAction
    )

    if (opponentOutput === OpponentOutput.DeckMatch) {
      game.updateUI(
        deck,
        player,
        opponent,
        playerTurnHandler,
        dispatchGameAction
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
  game.updateUI(
    deck,
    player,
    opponent,
    playerTurnHandler,
    dispatchGameAction,
    true
  )
  dispatchGameAction({ type: "GAME_LOG", log })
}

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
}
