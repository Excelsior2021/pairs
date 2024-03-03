import Card from "./Card"

export default class Player {
  hand: Card[]
  pairs: Card[]

  constructor() {
    this.hand = []
    this.pairs = []
  }
}
