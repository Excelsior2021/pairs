import { GameAction, OpponentOutput } from "@enums"

import type { Deck, Game } from "@game-objects"
import type { card, dispatchAction } from "@types"

export class Opponent {
  hand: card[]
  pairs: card[]
  request: card | null
  dispatchAction: dispatchAction

  constructor(dispatchAction: dispatchAction) {
    this.hand = []
    this.pairs = []
    this.request = null
    this.dispatchAction = dispatchAction
  }

  ask() {
    this.request = this.hand[Math.floor(Math.random() * this.hand.length)]
    return this.request
  }

  dealt(game: Game, deck: Deck) {
    const dealtCard = deck.deck.pop()

    if (dealtCard && this.request) {
      if (dealtCard.value === this.request.value) {
        const requestedCardIndex = this.hand.indexOf(this.request)
        this.pairs.push(dealtCard)
        this.pairs.push(this.request)
        if (requestedCardIndex !== -1) this.hand.splice(requestedCardIndex, 1)
        game.updateUI()
        return OpponentOutput.DeckMatch
      }

      for (const card of this.hand) {
        if (dealtCard.value === card.value) {
          const handMatchIndex = this.hand.indexOf(card)
          this.pairs.push(dealtCard)
          this.pairs.push(card)
          if (handMatchIndex !== -1) this.hand.splice(handMatchIndex, 1)
          game.updateUI()
          return OpponentOutput.HandMatch
        }
      }

      this.hand.push(dealtCard)
      game.updateUI()
      return OpponentOutput.NoMatch
    }
  }

  turn(game: Game) {
    const gameOver = game.end()

    if (!gameOver) {
      this.ask()
      if (this.request) {
        const log = `Do you have a ${this.request.value}?`
        this.dispatchAction({
          type: GameAction.GAME_LOG,
          log,
        })

        game.updateUI(false, true)
      }
    }
  }
}
