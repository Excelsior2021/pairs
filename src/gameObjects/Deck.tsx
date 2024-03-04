import { JSX } from "solid-js/jsx-runtime"
import Card from "./Card"

export default class Deck {
  deck: Card[]

  constructor() {
    this.deck = this.create()
  }

  create() {
    const deck: Card[] = new Array(52)
    const non_num_cards = ["ace", "jack", "queen", "king"]
    const suits = ["clubs", "diamonds", "hearts", "spades"]
    let deckIndex = 0

    for (const value of non_num_cards) {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        const img = `./cards/${id}.png`
        deck[deckIndex] = new Card(id, value, suit, img)
        deckIndex++
      }
    }

    for (let value = 2; value < 11; value++) {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        const img = `./cards/${id}.png`
        deck[deckIndex] = new Card(id, value, suit, img)
        deckIndex++
      }
    }

    return deck
  }

  shuffle() {
    for (const x in this.deck) {
      const y = Math.floor(Math.random() * parseInt(x))
      const temp = this.deck[x]
      this.deck[x] = this.deck[y]
      this.deck[y] = temp
    }
    return this.deck
  }

  dealCard() {
    return this.deck.pop()
  }

  dealHand(handSize: number) {
    const hand: Card[] = new Array(handSize)
    for (let i = 0; i < handSize; i++) hand[i] = this.dealCard()!
    return hand
  }

  deckUI(
    gameDeckHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  ) {
    console.log("hello", gameDeckHandler)
    return (
      <img
        class="card card--deck"
        src={`./cards/back.png`}
        alt="game deck"
        onclick={gameDeckHandler}
      />
    )
  }
}
