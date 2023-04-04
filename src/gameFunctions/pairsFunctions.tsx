import { For } from "solid-js"
import player from "./playerFunctions"
import deck from "./deckFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { card, playerHandEventType } from "../types/general"
import { gameOverType, updateUIType } from "../types/function-types"

export const initialPairs = (hand: card[]) => {
  const pairs: card[] = []
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

export const createPairsUI = (pairs: card[]) => (
  <For each={pairs}>
    {card => <img id={card.id} class="card" src={card.img} alt={card.id} />}
  </For>
)

const updateUI: updateUIType = (
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  shuffledDeck,
  playerHandUnclickable = false
) => {
  const playerTurnEventHandler = (playerHandEvent: playerHandEventType) =>
    player.playerTurnHandler(
      playerHandEvent,
      shuffledDeck,
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
  const newDeck: card[] = deck.createDeck()
  const shuffledDeck: card[] = deck.shuffleDeck(newDeck)

  const playerHand = deck.dealHand(shuffledDeck, 7)
  const opponentHand = deck.dealHand(shuffledDeck, 7)

  const playerPairs = initialPairs(playerHand)
  const opponentPairs = initialPairs(opponentHand)

  const log =
    "The cards have been dealt. Any initial pairs of cards have been added to your Pairs. Please select a card from your hand to request a matchwith your opponent."

  updateUI(playerHand, opponentHand, playerPairs, opponentPairs, shuffledDeck)
  dispatchGameAction({ type: "GAME_LOG", log })
}

export const gameOver: gameOverType = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  if (
    playerHand.length === 0 ||
    opponentHand.length === 0 ||
    shuffledDeck.length === 0
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
          <p class="game__game-over-text">Player Pairs: {playerPairs.length}</p>
          <p class="game__game-over-text">
            Opponent Pairs: {opponentPairs.length}
          </p>
          <p class="game__game-over-text">
            Remaining cards in deck: {shuffledDeck.length}
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
      shuffledDeck,
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
