import Card from "./Card"
import Deck from "./Deck"
import Player from "./Player"
import Game from "./Game"
import { playerTurnHandlerType } from "../types/function-types"
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
    playerTurnHandler: playerTurnHandlerType,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const dealtCard = deck.dealCard()

    if (dealtCard) {
      if (this.asked) {
        if (dealtCard.value === this.asked.value) {
          this.pairs.push(dealtCard)
          this.pairs.push(this.asked)
          this.hand.splice(this.hand.indexOf(this.asked), 1)
          game.updateUI(
            deck,
            player,
            this,
            playerTurnHandler,
            dispatchGameAction
          )
          return OpponentOutput.DeckMatch
        }

        for (const card of this.hand) {
          if (dealtCard.value === card.value) {
            this.pairs.push(dealtCard)
            this.pairs.push(card)
            this.hand.splice(this.hand.indexOf(card), 1)
            game.updateUI(
              deck,
              player,
              this,
              playerTurnHandler,
              dispatchGameAction
            )

            return OpponentOutput.HandMatch
          }
        }
      }

      this.hand.push(dealtCard)
      game.updateUI(deck, player, this, playerTurnHandler, dispatchGameAction)
      return OpponentOutput.NoMatch
    }
  }

  turn(
    game: Game,
    deck: Deck,
    player: Player,
    playerTurnHandler: playerTurnHandlerType,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const gameOver = game.end(
      deck,
      player,
      this,
      playerTurnHandler,
      dispatchGameAction
    )

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
        playerTurnHandler,
        dispatchGameAction,
        false,
        null,
        true,
        opponentRequest
      )
    }
  }
}
