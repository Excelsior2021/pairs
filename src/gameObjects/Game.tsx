import { playerTurnHandler } from "../gameFunctions/playerFunctions"
import { playerTurnHandlerType } from "../types/function-types"
import { gameAction, playerHandEventType } from "../types/general"
import Card from "./Card"
import Deck from "./Deck"
import Opponent from "./Opponent"
import Player from "./Player"

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
      "The cards have been dealt. Any initial pairs of cards have been added to your Pairs. Please select a card from your hand to request a match with your opponent."

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
    playerHandClickable = false
  ) {
    const playerTurnEventHandler = (playerHandEvent: playerHandEventType) =>
      playerTurnHandler(playerHandEvent, this, deck, player, opponent)

    dispatchGameAction({
      type: "UPDATE",
      game: this,
      deck,
      player,
      opponent,
      playerTurnEventHandler,
      playerHandClickable,
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
      const log = (
        <div class="game__game-over">
          <div class="game__outcome">
            <h2 class="game__game-over-heading">GAME OVER</h2>
            <p class="game__game-over-text">{outcome}</p>
          </div>
          <div class="game__stats">
            <h2 class="game__game-over-heading">STATS</h2>
            <p class="game__game-over-text">
              Your Pairs: {player.pairs.length}
            </p>
            <p class="game__game-over-text">
              Opponent Pairs: {opponent.pairs.length}
            </p>
            <p class="game__game-over-text">
              Remaining cards in deck: {deck.deck.length}
            </p>
          </div>
        </div>
      )
      dispatchGameAction({ type: "GAME_LOG", log })

      this.updateUI(
        deck,
        player,
        opponent,
        playerTurnHandler,
        dispatchGameAction
      )
      dispatchGameAction({ type: "GAME_OVER" })
      return true
    }
  }
}
