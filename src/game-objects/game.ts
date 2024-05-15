import Deck from "./deck"
import Opponent from "./opponent"
import Player from "./player"
import { GameAction, Outcome } from "../enums"

import type Card from "./card"
import type { gameAction } from "../../types"

export default class Game {
  start(dispatchGameAction: (action: gameAction) => void) {
    const deck = new Deck()
    const player = new Player()
    const opponent = new Opponent()

    deck.shuffle()

    player.hand = deck.dealHand(7)
    opponent.hand = deck.dealHand(7)

    player.pairs = this.initialPairs(player.hand)
    opponent.pairs = this.initialPairs(opponent.hand)

    const log =
      "The cards have been dealt. Any initial pair of cards have been added to your Pairs. Please select a card from your hand to request a match with your opponent."

    this.updateUI(deck, player, opponent, dispatchGameAction, true)
    dispatchGameAction({ type: GameAction.GAME_LOG, log })
  }

  initialPairs(hand: Card[]) {
    const pairs: Card[] = []
    hand.forEach(cardX =>
      hand.forEach(cardY => {
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
      hand.forEach(cardH => {
        if (cardP === cardH) {
          hand.splice(hand.indexOf(cardH), 1)
        }
      })
    )
    return pairs
  }

  updateUI(
    deck: Deck,
    player: Player,
    opponent: Opponent,
    dispatchGameAction: (action: gameAction) => void,
    playerHandClickable = false,
    opponentTurn = false,
    deckClickable = false
  ) {
    const playerTurnHandlerFactory = (playerHandEvent: MouseEvent) =>
      player.turn(playerHandEvent, this, deck, opponent, dispatchGameAction)

    const playerResponseHandlerFactory = (hasCard: boolean) =>
      player.response(hasCard, this, deck, opponent, dispatchGameAction)

    const deckHandlerFactory = () =>
      deck.handler(this, player, opponent, dispatchGameAction)

    dispatchGameAction({
      type: GameAction.UPDATE,
      deck,
      player,
      opponent,
      playerTurnHandlerFactory,
      playerHandClickable,
      playerResponseHandlerFactory,
      deckHandlerFactory,
      deckClickable,
      opponentTurn,
    })
  }

  outcome(player: Player, opponent: Opponent) {
    let outcome
    if (player.pairs.length > opponent.pairs.length) {
      outcome = Outcome.Player
    } else if (player.pairs.length === opponent.pairs.length) {
      outcome = Outcome.Draw
    } else {
      outcome = Outcome.Opponent
    }
    return outcome
  }

  end(
    deck: Deck,
    player: Player,
    opponent: Opponent,
    dispatchGameAction: (action: gameAction) => void
  ) {
    if (
      player.hand.length === 0 ||
      opponent.hand.length === 0 ||
      deck.deck.length === 0
    ) {
      const outcome = this.outcome(player, opponent)

      this.updateUI(deck, player, opponent, dispatchGameAction)
      dispatchGameAction({
        type: GameAction.GAME_OVER,
        outcome,
        gameOver: true,
      })
      return true
    }
    return false
  }
}
