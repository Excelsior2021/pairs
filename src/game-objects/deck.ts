import Card, { nonNumValue, suit } from "./card"
import Game from "./game"
import Opponent from "./opponent"
import Player from "./player"
import { gameAction } from "../../types"
import { GameAction, PlayerOutput } from "../enums"

export default class Deck {
  deck: Card[]

  constructor() {
    this.deck = this.create()
  }

  create() {
    const deck: Card[] = new Array(52)
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
        const img = `./cards/${id}.png`
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
    const hand: Card[] = new Array(handSize)
    for (let i = 0; i < handSize; i++) hand[i] = this.dealCard()!
    return hand
  }

  handler(
    game: Game,
    player: Player,
    opponent: Opponent,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const playerOutput = player.dealt(game, this, opponent, dispatchGameAction)

    dispatchGameAction({
      type: GameAction.PLAYER_ACTION,
      playerOutput,
      player,
    })

    if (
      playerOutput === PlayerOutput.HandMatch ||
      playerOutput === PlayerOutput.NoMatch
    )
      opponent.turn(game, this, player, dispatchGameAction)

    game.end(this, player, opponent, dispatchGameAction)
  }
}
