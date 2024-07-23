import { nonNumValue, suit } from "./card"
import { GameAction, PlayerOutput } from "../enums"

import type CardType from "./card"
import type Game from "./game"
import type Opponent from "./opponent"
import type Player from "./player"
import type { dispatchGameActionType } from "../../types"

export default class Deck {
  deck: CardType[]
  dispatchGameAction: dispatchGameActionType

  constructor(
    Card: typeof CardType,
    dispatchGameAction: dispatchGameActionType
  ) {
    this.deck = this.create(Card)
    this.dispatchGameAction = dispatchGameAction
  }

  create(Card: typeof CardType) {
    const deck: CardType[] = new Array(52)
    const non_num_cards = [
      nonNumValue.ace,
      nonNumValue.jack,
      nonNumValue.queen,
      nonNumValue.king,
    ]
    const suits = [suit.clubs, suit.diamonds, suit.hearts, suit.spades]
    let deckIndex = 0

    const createSuits = (value: number | nonNumValue) => {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        const img = `./cards/${id}.webp`
        deck[deckIndex] = new Card(id, value, suit, img)
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
    const hand: CardType[] = new Array(handSize)
    for (let i = 0; i < handSize; i++) hand[i] = this.dealCard()!
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
