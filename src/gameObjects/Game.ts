import { playerTurnHandlerType } from "../types/function-types"
import { gameAction, playerHandEventType } from "../types/general"
import Card from "./Card"
import Deck from "./Deck"
import Opponent from "./Opponent"
import Player from "./Player"

export default class Game {
  start(
    playerTurnHandler: playerTurnHandlerType,
    dispatchGameAction: (action: gameAction) => void
  ) {
    const deck = new Deck()
    const player = new Player()
    const opponent = new Opponent()

    deck.shuffle()

    player.hand = deck.dealHand(20)
    opponent.hand = deck.dealHand(20)

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
    playerChosenCardEvent = null,
    opponentTurn = false,
    opponentRequest = null,
    deckClickable = false
  ) {
    const playerTurnHandlerWrapper = (playerHandEvent: playerHandEventType) =>
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
      let outcome
      if (player.pairs.length > opponent.pairs.length) {
        outcome = "You won! Well done!"
      } else if (player.pairs.length === opponent.pairs.length) {
        outcome = "It's a draw!"
      } else {
        outcome = "Your opponent won! Better luck next time!"
      }

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
