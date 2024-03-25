import { playerTurnHandlerType } from "../types/function-types"
import { gameAction } from "../types/general"
import Card from "./Card"
import Deck from "./Deck"
import Opponent from "./Opponent"
import Player from "./Player"
import { Outcome } from "../types/enums"

export default class Game {
  start(
    playerTurnHandler: playerTurnHandlerType,
    dispatchGameAction: (action: gameAction) => void
  ) {
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

    this.updateUI(
      deck,
      player,
      opponent,
      playerTurnHandler,
      dispatchGameAction,
      true
    )
    dispatchGameAction({ type: "GAME_LOG", log })
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
    playerTurnHandler: playerTurnHandlerType,
    dispatchGameAction: (action: gameAction) => void,
    playerHandClickable = false,
    playerChosenCardEvent: MouseEvent | null = null,
    opponentTurn = false,
    opponentRequest: Card | null = null,
    deckClickable = false
  ) {
    const playerTurnHandlerWrapper = (playerHandEvent: MouseEvent) =>
      playerTurnHandler(playerHandEvent, this, deck, player, opponent)

    dispatchGameAction({
      type: "UPDATE",
      game: this,
      deck,
      player,
      opponent,
      playerTurnHandlerWrapper,
      playerHandClickable,
      playerChosenCardEvent,
      opponentTurn,
      opponentRequest,
      deckClickable,
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
    playerTurnHandler: playerTurnHandlerType,
    dispatchGameAction: (action: gameAction) => void
  ) {
    if (
      player.hand.length === 0 ||
      opponent.hand.length === 0 ||
      deck.deck.length === 0
    ) {
      const outcome = this.outcome(player, opponent)

      this.updateUI(
        deck,
        player,
        opponent,
        playerTurnHandler,
        dispatchGameAction
      )
      dispatchGameAction({ type: "GAME_OVER", outcome, gameOver: true })
      return true
    }
    return false
  }
}
