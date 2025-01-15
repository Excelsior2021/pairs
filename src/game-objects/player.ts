import { Action, OpponentOutput, PlayerOutput } from "@enums"

import type { Deck, Game, Opponent } from "@game-objects"
import type { card, handleAction } from "@types"

export class Player {
  hand: card[]
  pairs: card[]
  chosenCard: card | null
  handleAction: handleAction

  constructor(handleAction: handleAction) {
    this.hand = []
    this.pairs = []
    this.chosenCard = null
    this.handleAction = handleAction
  }

  match(game: Game, opponent: Opponent) {
    if (this.chosenCard) {
      for (const card of opponent.hand) {
        if (card.value === this.chosenCard.value) {
          this.pairs.push(card)
          opponent.hand.splice(opponent.hand.indexOf(card), 1)

          for (const card of this.hand) {
            if (this.chosenCard!.id === card.id) {
              this.pairs.push(card)
              this.hand.splice(this.hand.indexOf(card), 1)
              game.updateUI("", true)
              this.chosenCard = null
              return PlayerOutput.OpponentMatch
            }
          }
        }
      }
      return PlayerOutput.NoOpponentMatch
    }
  }

  dealt(game: Game, deck: Deck) {
    const dealtCard = deck.deck.pop()

    if (this.chosenCard && dealtCard) {
      if (this.chosenCard.value === dealtCard.value) {
        this.pairs.push(dealtCard)
        for (const card of this.hand) {
          if (this.chosenCard.id === card.id) {
            this.pairs.push(card)
            this.hand.splice(this.hand.indexOf(card), 1)
            game.updateUI("", true)
            return PlayerOutput.DeckMatch
          }
        }
      }

      this.chosenCard = null

      for (const card of this.hand) {
        if (dealtCard.value === card.value) {
          this.pairs.push(dealtCard)
          this.pairs.push(card)
          this.hand.splice(this.hand.indexOf(card), 1)
          game.updateUI()
          return PlayerOutput.HandMatch
        }
      }

      this.hand.push(dealtCard)
      game.updateUI()
      return PlayerOutput.NoMatch
    }
  }

  turn(playerChosenCardEvent: MouseEvent, game: Game, opponent: Opponent) {
    const eventTarget = playerChosenCardEvent.target as HTMLImageElement
    for (const card of this.hand)
      if (card.id === eventTarget.id) {
        this.chosenCard = card
        break
      }

    const playerOutput = this.match(game, opponent)

    if (playerOutput! < PlayerOutput.NoOpponentMatch) {
      this.handleAction({
        type: Action.PLAYER_ACTION,
        playerOutput,
      })
    } else {
      const gameOver = game.end()
      if (!gameOver) {
        if (playerOutput === PlayerOutput.NoOpponentMatch) {
          const log =
            "You didn't match with any card in your opponent's hand. Please deal a card from the deck."
          game.updateUI(log, false, false, true)
        }
      }
    }
  }

  response(hasCard: boolean, game: Game, deck: Deck, opponent: Opponent) {
    const opponentTurn = () => opponent.turn(game)

    if (opponent.request) {
      if (hasCard) {
        for (const card of this.hand) {
          if (card.value === opponent.request.value) {
            opponent.pairs.push(opponent.request)
            opponent.hand.splice(opponent.hand.indexOf(opponent.request), 1)

            opponent.pairs.push(card)
            this.hand.splice(this.hand.indexOf(card), 1)

            const log = "It's your opponent's turn again."
            game.updateUI(log)

            setTimeout(opponentTurn, 2000)
            return
          }
        }
        const log = `Are you sure? Do you have a ${opponent.request.value}?`

        game.updateUI(log)
        return
      }

      if (!hasCard) {
        for (const card of this.hand) {
          if (card.value === opponent.request.value) {
            const log = `Are you sure? Do you have a ${opponent.request.value}?`

            game.updateUI(log)
            return
          }
        }

        const opponentOutput = opponent.dealt(game, deck)

        if (opponentOutput === OpponentOutput.DeckMatch) {
          const log =
            "Your opponent has dealt a card from the deck and matched with the dealt card. It's your opponent's turn again."
          game.updateUI(log)
          setTimeout(opponentTurn, 2000)
        }

        if (opponentOutput === OpponentOutput.HandMatch) {
          const log =
            "Your opponent has dealt a card from the deck. They didn't match with the dealt card but they had a hand match. It's your turn."
          game.updateUI(log, true)
        }
        if (opponentOutput === OpponentOutput.NoMatch) {
          const log =
            "Your opponent has dealt a card from the deck and added it to their hand. There were no matches. It's your turn."
          game.updateUI(log, true)
        }
      }
    }
  }
}
