import Card from "./Card"

export default class Opponent {
  hand: Card[]
  pairs: Card[]

  constructor() {
    this.hand = []
    this.pairs = []
  }
}
