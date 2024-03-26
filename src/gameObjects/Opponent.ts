import Card from "./Card"
import Deck from "./Deck"
import Player from "./Player"
import Game from "./Game"
import { gameAction } from "../types/general"
import { OpponentOutput } from "../types/enums"

export default class Opponent {
  hand: Card[]
  pairs: Card[]
  asked: Card | null

  constructor() {
    this.hand = []
    this.pairs = []
    this.asked = null
  }

  ask() {
    this.asked = this.hand[Math.floor(Math.random() * this.hand.length)]
    return this.asked
  }

  dealt(
    game: Game,
    deck: Deck,
    player: Player,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const dealtCard = deck.dealCard()

    if (dealtCard && this.asked) {
      if (dealtCard.value === this.asked.value) {
        const requestedCardIndex = this.hand.indexOf(this.asked)
        this.pairs.push(dealtCard)
        this.pairs.push(this.asked)
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
      const opponentRequest = this.ask()
      const log = `Do you have a ${opponentRequest.value}?`
      dispatchGameAction({
        type: "GAME_LOG",
        log,
      })

      game.updateUI(
        deck,
        player,
        this,
        dispatchGameAction,
        false,
        null,
        true,
        opponentRequest
      )
    }
  }
}
