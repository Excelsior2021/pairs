import { For } from "solid-js"
import player from "./playerFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { playerHandEventType } from "../types/general"
import { gameOverType, updateUIType } from "../types/function-types"
import { Card, Deck } from "../store/classes"

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
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  deck,
  playerHandUnclickable = false
) => {
  const playerTurnEventHandler = (playerHandEvent: playerHandEventType) =>
    player.playerTurnHandler(
      playerHandEvent,
      deck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )

  dispatchGameAction({
    type: "UPDATE",
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnEventHandler,
    playerHandUnclickable,
  })
}

export const startGame = () => {
  const deck = new Deck()
  deck.shuffle()

  const playerHand = deck.dealHand(7)
  const opponentHand = deck.dealHand(7)

  const playerPairs = initialPairs(playerHand)
  const opponentPairs = initialPairs(opponentHand)

  const log =
    "The cards have been dealt. Any initial pairs of cards have been added to your Pairs. Please select a card from your hand to request a matchwith your opponent."

  updateUI(playerHand, opponentHand, playerPairs, opponentPairs, deck)
  dispatchGameAction({ type: "GAME_LOG", log })
}

export const gameOver: gameOverType = (
  deck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  if (
    playerHand.length === 0 ||
    opponentHand.length === 0 ||
    deck.length === 0
  ) {
    let outcome
    if (playerPairs.length > opponentPairs.length) {
      outcome = "You won! Well done!"
    } else if (playerPairs.length === opponentPairs.length) {
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
          <p class="game__game-over-text">Your Pairs: {playerPairs.length}</p>
          <p class="game__game-over-text">
            Opponent Pairs: {opponentPairs.length}
          </p>
          <p class="game__game-over-text">
            Remaining cards in deck: {deck.length}
          </p>
        </div>
      </div>
    )
    dispatchGameAction({ type: "GAME_LOG", log })
    const playerHandUnclickable = true
    updateUI(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      deck,
      playerHandUnclickable
    )
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
