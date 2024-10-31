import type { suit, nonNumCardValue } from "@/enums"
export class Card {
  id: string
  value: nonNumCardValue | number
  suit: suit
  img: string

  constructor(
    id: string,
    value: nonNumCardValue | number,
    suit: suit,
    img: string
  ) {
    this.id = id
    this.value = value
    this.suit = suit
    this.img = img
  }
}
