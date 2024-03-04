import { For } from "solid-js"
import playerFunctions from "./playerFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { playerHandEventType } from "../types/general"
import { gameOverType, updateUIType } from "../types/function-types"
import Card from "../gameObjects/Card"
import Deck from "../gameObjects/Deck"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"

export const initialPairs = (hand: Card[]) => {
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

export const createPairsUI = (pairs: Card[]) => (
  <For each={pairs}>
    {card => <img id={card.id} class="card" src={card.img} alt={card.id} />}
  </For>
)

const updateUI: updateUIType = (
  deck,
  player,
  opponent,
  playerHandClickable = true
) => {
  const playerTurnEventHandler = (playerHandEvent: playerHandEventType) =>
    playerFunctions.playerTurnHandler(playerHandEvent, deck, player, opponent)

  console.log(deck)
  dispatchGameAction({
    type: "UPDATE",
    deck,
    player,
    opponent,
    playerTurnEventHandler,
    playerHandClickable,
  })
}

export const startGame = () => {
  const deck = new Deck()
  const player = new Player()
  const opponent = new Opponent()

  deck.shuffle()

  player.hand = deck.dealHand(7)
  opponent.hand = deck.dealHand(7)

  player.pairs = initialPairs(player.hand)
  opponent.pairs = initialPairs(opponent.hand)

  const log =
    "The cards have been dealt. Any initial pairs of cards have been added to your Pairs. Please select a card from your hand to request a match with your opponent."

  updateUI(deck, player, opponent)
  dispatchGameAction({ type: "GAME_LOG", log })
}

export const gameOver: gameOverType = (deck, player, opponent) => {
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
          <p class="game__game-over-text">Your Pairs: {player.pairs.length}</p>
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
    const playerHandClickable = true
    updateUI(deck, player, opponent, playerHandClickable)
    dispatchGameAction({ type: "GAME_OVER" })
    return true
  }
}

export default {
  initialPairs,
  createPairsUI,
  updateUI,
  startGame,
  gameOver,
}
