import { Action, PlayerOutput } from "@enums"

import type { Game, Opponent, Player } from "@game-objects"
import type { card, handleAction } from "@types"

export class Deck {
  deck: card[]
  handleAction: handleAction

  constructor(deck: card[], handleAction: handleAction) {
    this.deck = structuredClone(deck)
    this.handleAction = handleAction
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

    this.handleAction({
      type: Action.PLAYER_ACTION,
      playerOutput,
    })

    if (
      playerOutput === PlayerOutput.HandMatch ||
      playerOutput === PlayerOutput.NoMatch
    )
      opponent.turn(game)

    game.end()
  }
}
