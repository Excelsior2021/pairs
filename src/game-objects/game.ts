import { Action, Outcome } from "@enums"

import type { Deck, Player, Opponent } from "@game-objects"
import type { card, handleAction } from "@types"

export class Game {
  deck: Deck
  player: Player
  opponent: Opponent
  handleAction: handleAction
  initialHandSize: number
  playerTurnHandler
  playerResponseHandler
  playerDealsHandler

  constructor(
    Deck: Deck,
    Player: Player,
    Opponent: Opponent,
    handleAction: handleAction
  ) {
    this.deck = Deck
    this.player = Player
    this.opponent = Opponent
    this.handleAction = handleAction
    this.initialHandSize = 7
    this.playerTurnHandler = (chosenCard: MouseEvent) =>
      this.player.turn(chosenCard, this, this.opponent)
    this.playerResponseHandler = (hasCard: boolean) =>
      this.player.response(hasCard, this, this.deck, this.opponent)
    this.playerDealsHandler = () =>
      this.deck.deal(this, this.player, this.opponent)
  }

  start() {
    this.deck.shuffle()

    this.player.hand = this.deck.deck.splice(0, this.initialHandSize)
    this.opponent.hand = this.deck.deck.splice(0, this.initialHandSize)

    this.player.pairs = this.initialPairs(this.player.hand)
    this.opponent.pairs = this.initialPairs(this.opponent.hand)

    const log =
      "The cards have been dealt. Any initial pair of cards have been added to your Pairs. Please select a card from your hand to request a match with your opponent."

    this.updateUI(log, true)
  }

  initialPairs(hand: card[]) {
    const pairs: card[] = []
    hand.forEach(cardX =>
      hand.some(cardY => {
        if (
          cardX.value === cardY.value &&
          cardX.suit !== cardY.suit &&
          !pairs.includes(cardX) &&
          !pairs.includes(cardY)
        )
          pairs.push(cardX, cardY)
      })
    )

    pairs.forEach(cardP =>
      hand.some(cardH => {
        if (cardP === cardH) hand.splice(hand.indexOf(cardH), 1)
      })
    )
    return pairs
  }

  updateUI(
    log = "",
    isPlayerTurn = false,
    isOpponentTurn = false,
    isDealFromDeck = false
  ) {
    const player = { hand: this.player.hand, pairs: this.player.pairs }
    const opponent = { hand: this.opponent.hand, pairs: this.opponent.pairs }

    this.handleAction({
      type: Action.UPDATE,
      log,
      player,
      opponent,
      isPlayerTurn,
      isOpponentTurn,
      isDealFromDeck,
    })
  }

  outcome() {
    if (this.player.pairs.length > this.opponent.pairs.length)
      return Outcome.Player
    else if (this.player.pairs.length === this.opponent.pairs.length)
      return Outcome.Draw
    else return Outcome.Opponent
  }

  end() {
    if (
      this.player.hand.length === 0 ||
      this.opponent.hand.length === 0 ||
      this.deck.deck.length === 0
    ) {
      const outcome = this.outcome()

      this.handleAction({
        type: Action.GAME_OVER,
        outcome,
        gameOver: true,
        deckCount: this.deck.deck.length,
      })
      return true
    }
    return false
  }
}
