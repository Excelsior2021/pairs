import Card from "./card"
import Deck from "./deck"
import Player from "./player"
import Game from "./game"
import { gameAction } from "../../types"
import { GameAction, OpponentOutput } from "../enums"

export default class Opponent {
  hand: Card[]
  pairs: Card[]
  request: Card | null

  constructor() {
    this.hand = []
    this.pairs = []
    this.request = null
  }

  ask() {
    this.request = this.hand[Math.floor(Math.random() * this.hand.length)]
    return this.request
  }

  dealt(
    game: Game,
    deck: Deck,
    player: Player,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const dealtCard = deck.dealCard()

    if (dealtCard && this.request) {
      if (dealtCard.value === this.request.value) {
        const requestedCardIndex = this.hand.indexOf(this.request)
        this.pairs.push(dealtCard)
        this.pairs.push(this.request)
        if (requestedCardIndex !== -1) this.hand.splice(requestedCardIndex, 1)
        game.updateUI(deck, player, this, dispatchGameAction)
        return OpponentOutput.DeckMatch
      }

      for (const card of this.hand) {
        if (dealtCard.value === card.value) {
          const handMatchIndex = this.hand.indexOf(card)
          this.pairs.push(dealtCard)
          this.pairs.push(card)
          if (handMatchIndex !== -1) this.hand.splice(handMatchIndex, 1)
          game.updateUI(deck, player, this, dispatchGameAction)
          return OpponentOutput.HandMatch
        }
      }

      this.hand.push(dealtCard)
      game.updateUI(deck, player, this, dispatchGameAction)
      return OpponentOutput.NoMatch
    }
  }

  turn(
    game: Game,
    deck: Deck,
    player: Player,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const gameOver = game.end(deck, player, this, dispatchGameAction)

    if (!gameOver) {
      this.ask()
      if (this.request) {
        const log = `Do you have a ${this.request.value}?`
        dispatchGameAction({
          type: GameAction.GAME_LOG,
          log,
        })

        game.updateUI(deck, player, this, dispatchGameAction, false, true)
      }
    }
  }
}
