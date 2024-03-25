import { dispatchGameAction } from "../components/Session/Session"
import {
  playerDealtType,
  playerMatchType,
  playerResponseHandlerType,
  playerTurnHandlerType,
} from "../types/function-types"
import { OpponentOutput, PlayerOutput } from "../types/enums"

export const playerMatch: playerMatchType = (
  playerChosenCardEvent,
  game,
  deck,
  player,
  opponent
) => {
  let chosenCard

  for (const card of player.hand) {
    if (card.id === playerChosenCardEvent.target!.id) chosenCard = card
  }

  if (chosenCard) {
    for (const card of opponent.hand) {
      if (card.value === chosenCard.value) {
        player.pairs.push(card)
        opponent.hand.splice(opponent.hand.indexOf(card), 1)

        for (const card of player.hand) {
          if (playerChosenCardEvent.target!.id === card.id) {
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
            dispatchGameAction({ type: "GAME_LOG", log: "" })
            return PlayerOutput.OpponentMatch
          }
        }
      }
    }
    return PlayerOutput.NoOpponentMatch
  }
}

export const playerDealt: playerDealtType = (
  playerChosenCardEvent,
  game,
  deck,
  player,
  opponent
) => {
  const dealtCard = deck.dealCard()
  let chosenCard

  for (const card of player.hand) {
    if (card.id === playerChosenCardEvent.target!.id) chosenCard = card
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
          dispatchGameAction({ type: "GAME_LOG", log: "" })
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
  playerChosenCardEvent,
  game,
  deck,
  player,
  opponent
) => {
  const playerOutput = playerMatch(
    playerChosenCardEvent,
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

  const gameOver = game.end(
    deck,
    player,
    opponent,
    playerTurnHandler,
    dispatchGameAction
  )

  if (!gameOver) {
    if (playerOutput === PlayerOutput.NoOpponentMatch) {
      const log =
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck."
      game.updateUI(
        deck,
        player,
        opponent,
        playerTurnHandler,
        dispatchGameAction,
        false,
        playerChosenCardEvent,
        false,
        null,
        true
      )
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
  opponentRequest
) => {
  const opponentTurn = () =>
    opponent.turn(game, deck, player, playerTurnHandler, dispatchGameAction)

  let log

  if (hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentRequest.value) {
        opponent.pairs.push(opponentRequest)
        opponent.hand.splice(opponent.hand.indexOf(opponentRequest), 1)

        opponent.pairs.push(card)
        player.hand.splice(player.hand.indexOf(card), 1)

        game.updateUI(
          deck,
          player,
          opponent,
          playerTurnHandler,
          dispatchGameAction
        )
        opponent.turn(game, deck, player, playerTurnHandler, dispatchGameAction)
        return
      }
    }
    log = `Are you sure? Do you have a ${opponentRequest.value}?`

    dispatchGameAction({
      type: "GAME_LOG",
      log,
    })
    return
  }

  if (!hasCard) {
    for (const card of player.hand) {
      if (card.value === opponentRequest.value) {
        log = `Are you sure? Do you have a ${opponentRequest.value}?`

        dispatchGameAction({
          type: "GAME_LOG",
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
        "Your opponent has dealt a card from the deck. They didn't match with the dealt card but they had a hand match. It's your turn."
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
    true,
    null,
    false,
    opponentRequest
  )
  dispatchGameAction({ type: "GAME_LOG", log })
}

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
}
