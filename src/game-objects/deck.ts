import { nonNumCardValue, suit } from "@/enums"
import { GameAction, PlayerOutput } from "@/enums"

import type { Game, Opponent, Player } from "@/game-objects"
import type { Card, dispatchGameActionType } from "@/types"

export class Deck {
  deck: Card[]
  dispatchGameAction: dispatchGameActionType

  constructor(dispatchGameAction: dispatchGameActionType) {
    this.deck = this.create()
    this.dispatchGameAction = dispatchGameAction
  }

  create() {
    const deck: Card[] = new Array(52)
    const non_num_cards = [
      nonNumCardValue.ace,
      nonNumCardValue.jack,
      nonNumCardValue.queen,
      nonNumCardValue.king,
    ]
    const suits = [suit.clubs, suit.diamonds, suit.hearts, suit.spades]
    let deckIndex = 0

    const createSuits = (value: number | nonNumCardValue) => {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`

        const card = {
          id,
          value,
          suit,
          img: `./cards/${id}.webp`,
        }

        deck[deckIndex] = card

        deckIndex++
      }
    }

    for (const value of non_num_cards) createSuits(value)

    for (let value = 2; value < 11; value++) createSuits(value)

    return deck
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
