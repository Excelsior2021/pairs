export enum suit {
  clubs = "clubs",
  diamonds = "diamonds",
  hearts = "hearts",
  spades = "spades",
}

export enum nonNumValue {
  ace = "ace",
  jack = "jack",
  queen = "queen",
  king = "king",
}

export default class Card {
  id: string
  value: nonNumValue | number
  suit: suit
  img: string

  constructor(
    id: string,
    value: nonNumValue | number,
    suit: suit,
    img: string
  ) {
    this.id = id
    this.value = value
    this.suit = suit
    this.img = img
  }
}
