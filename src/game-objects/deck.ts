import { GameAction, PlayerOutput } from "@/enums"

import type { Game, Opponent, Player } from "@/game-objects"
import type { Card, dispatchGameActionType } from "@/types"

export class Deck {
  deck: Card[]
  dispatchGameAction: dispatchGameActionType

  constructor(deck: Card[], dispatchGameAction: dispatchGameActionType) {
    this.deck = structuredClone(deck)
    this.dispatchGameAction = dispatchGameAction
  }

  shuffle() {
    for (const x in this.deck) {
      const y = Math.floor(Math.random() * parseInt(x))
      const temp = this.deck[x]
      this.deck[x] = this.deck[y]
      this.deck[y] = temp
    }
  }

  dealCard = () => this.deck.pop()

  dealHand(handSize: number) {
    const hand: Card[] = this.deck.splice(0, handSize)
    return hand
  }

  handler(game: Game, player: Player, opponent: Opponent) {
    const playerOutput = player.dealt(game, this)

    this.dispatchGameAction({
      type: GameAction.PLAYER_ACTION,
      playerOutput,
      player,
    })

    if (
      playerOutput === PlayerOutput.HandMatch ||
      playerOutput === PlayerOutput.NoMatch
    )
      opponent.turn(game)

    game.end()
  }
}
