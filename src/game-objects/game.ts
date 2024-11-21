import { GameAction, Outcome } from "@/enums"

import type { Deck, Player, Opponent } from "@/game-objects"
import type { Card, dispatchGameActionType } from "@/types"

export class Game {
  deck: Deck
  player: Player
  opponent: Opponent
  dispatchGameAction: dispatchGameActionType
  initialHandSize: number
  playerTurnHandlerFactory
  playerResponseHandlerFactory
  deckHandlerFactory

  constructor(
    Deck: Deck,
    Player: Player,
    Opponent: Opponent,
    dispatchGameAction: dispatchGameActionType
  ) {
    this.deck = Deck
    this.player = Player
    this.opponent = Opponent
    this.dispatchGameAction = dispatchGameAction
    this.initialHandSize = 7
    this.playerTurnHandlerFactory = (playerHandEvent: MouseEvent) =>
      this.player.turn(playerHandEvent, this, this.opponent)
    this.playerResponseHandlerFactory = (hasCard: boolean) =>
      this.player.response(hasCard, this, this.deck, this.opponent)
    this.deckHandlerFactory = () =>
      this.deck.handler(this, this.player, this.opponent)
  }

  start() {
    this.deck.shuffle()

    this.player.hand = this.deck.dealHand(this.initialHandSize)
    this.opponent.hand = this.deck.dealHand(this.initialHandSize)

    this.player.pairs = this.initialPairs(this.player.hand)
    this.opponent.pairs = this.initialPairs(this.opponent.hand)

    const log =
      "The cards have been dealt. Any initial pair of cards have been added to your Pairs. Please select a card from your hand to request a match with your opponent."

    this.updateUI(true)
    this.dispatchGameAction({ type: GameAction.GAME_LOG, log })
  }

  initialPairs(hand: Card[]) {
    const pairs: Card[] = []
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
    playerHandClickable = false,
    opponentTurn = false,
    deckClickable = false
  ) {
    this.dispatchGameAction({
      type: GameAction.UPDATE,
      deck: this.deck,
      player: this.player,
      opponent: this.opponent,
      playerTurnHandlerFactory: this.playerTurnHandlerFactory,
      playerHandClickable,
      playerResponseHandlerFactory: this.playerResponseHandlerFactory,
      deckHandlerFactory: this.deckHandlerFactory,
      deckClickable,
      opponentTurn,
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

      this.updateUI()
      this.dispatchGameAction({
        type: GameAction.GAME_OVER,
        outcome,
        gameOver: true,
      })
      return true
    }
    return false
  }
}
