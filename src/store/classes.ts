export class Card {
  id: string
  value: string | number
  suit: string
  img: string

  constructor(id: string, value: string | number, suit: string, img: string) {
    this.id = id
    this.value = value
    this.suit = suit
    this.img = img
  }
}
