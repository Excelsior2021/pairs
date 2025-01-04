import { GameAction, PlayerOutput } from "@enums"

import type { Game, Opponent, Player } from "@game-objects"
import type { card, dispatchActionType } from "@types"

export class Deck {
  deck: card[]
  dispatchAction: dispatchActionType

  constructor(deck: card[], dispatchAction: dispatchActionType) {
    this.deck = structuredClone(deck)
    this.dispatchAction = dispatchAction
  }

  shuffle() {
    for (const x in this.deck) {
      const y = Math.floor(Math.random() * parseInt(x))
      const temp = this.deck[x]
      this.deck[x] = this.deck[y]
      this.deck[y] = temp
    }
  }

  deal(game: Game, player: Player, opponent: Opponent) {
    const playerOutput = player.dealt(game, this)

    this.dispatchAction({
      action: GameAction.PLAYER_ACTION,
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
