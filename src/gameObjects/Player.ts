import { OpponentOutput, PlayerOutput } from "../types/enums"
import { gameAction } from "../types/general"
import Card from "./Card"
import Deck from "./Deck"
import Game from "./Game"
import Opponent from "./Opponent"

export default class Player {
  hand: Card[]
  pairs: Card[]

  constructor() {
    this.hand = []
    this.pairs = []
  }

  match(
    playerChosenCardEvent: MouseEvent,
    game: Game,
    deck: Deck,
    player: Player,
    opponent: Opponent,
    dispatchGameAction: (action: gameAction) => void
  ) {
    let chosenCard
    const eventTarget = playerChosenCardEvent.target as HTMLImageElement

    for (const card of player.hand)
      if (card.id === eventTarget!.id) chosenCard = card

    if (chosenCard) {
      for (const card of opponent.hand) {
        if (card.value === chosenCard.value) {
          player.pairs.push(card)
          opponent.hand.splice(opponent.hand.indexOf(card), 1)

          for (const card of player.hand) {
            if (eventTarget!.id === card.id) {
              player.pairs.push(card)
              player.hand.splice(player.hand.indexOf(card), 1)
              game.updateUI(deck, player, opponent, dispatchGameAction, true)
              dispatchGameAction({ type: "GAME_LOG", log: "" })
              return PlayerOutput.OpponentMatch
            }
          }
        }
      }
      return PlayerOutput.NoOpponentMatch
    }
  }

  dealt(
    playerChosenCardEvent: MouseEvent,
    game: Game,
    deck: Deck,
    player: Player,
    opponent: Opponent,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const dealtCard = deck.dealCard()
    let chosenCard
    const eventTarget = playerChosenCardEvent.target as HTMLImageElement

    for (const card of player.hand)
      if (card.id === eventTarget!.id) chosenCard = card

    if (chosenCard && dealtCard) {
      if (chosenCard.value === dealtCard.value) {
        player.pairs.push(dealtCard)
        for (let card of player.hand) {
          if (chosenCard.id === card.id) {
            player.pairs.push(card)
            player.hand.splice(player.hand.indexOf(card), 1)
            game.updateUI(deck, player, opponent, dispatchGameAction, true)
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
          game.updateUI(deck, player, opponent, dispatchGameAction)
          return PlayerOutput.HandMatch
        }
      }

      player.hand.push(dealtCard)
      game.updateUI(deck, player, opponent, dispatchGameAction)
      return PlayerOutput.NoMatch
    }
  }

  turn(
    playerChosenCardEvent: MouseEvent,
    game: Game,
    deck: Deck,
    player: Player,
    opponent: Opponent,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const playerOutput = this.match(
      playerChosenCardEvent,
      game,
      deck,
      player,
      opponent,
      dispatchGameAction
    )

    dispatchGameAction({
      type: "PLAYER_ACTION",
      playerOutput,
      player,
    })

    const gameOver = game.end(deck, player, opponent, dispatchGameAction)

    if (!gameOver) {
      if (playerOutput === PlayerOutput.NoOpponentMatch) {
        const log =
          "You didn't match with any card in your opponent's hand. Please deal a card from the deck."
        game.updateUI(
          deck,
          player,
          opponent,

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

  response(
    hasCard: boolean,
    game: Game,
    deck: Deck,
    player: Player,
    opponent: Opponent,
    opponentRequest: Card,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const opponentTurn = () =>
      opponent.turn(game, deck, player, dispatchGameAction)

    let log

    if (hasCard) {
      for (const card of player.hand) {
        if (card.value === opponentRequest.value) {
          opponent.pairs.push(opponentRequest)
          opponent.hand.splice(opponent.hand.indexOf(opponentRequest), 1)

          opponent.pairs.push(card)
          player.hand.splice(player.hand.indexOf(card), 1)

          game.updateUI(deck, player, opponent, dispatchGameAction)

          log = "It's your opponent's turn again."
          dispatchGameAction({ type: "GAME_LOG", log })
          setTimeout(opponentTurn, 2000)
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
        dispatchGameAction
      )

      if (opponentOutput === OpponentOutput.DeckMatch) {
        game.updateUI(deck, player, opponent, dispatchGameAction)
        log =
          "Your opponent has dealt a card from the deck and matched with the dealt card. It's your opponent's turn again."

        dispatchGameAction({ type: "GAME_LOG", log })
        setTimeout(opponentTurn, 2000)
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
      dispatchGameAction,
      true,
      null,
      false,
      opponentRequest
    )
    dispatchGameAction({ type: "GAME_LOG", log })
  }
}
