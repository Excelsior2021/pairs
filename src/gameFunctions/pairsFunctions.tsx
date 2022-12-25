import { For } from "solid-js"
import player from "./playerFunctions"
import opponent from "./opponentFunctions"
import deck from "./deckFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { card } from "../types/general"

export const initialPairs = (hand: card[]) => {
  let pairs: card[] = []
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

export const playerHandUnclickable = (
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI
) => {
  const playerHandUnclickable = true
  updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    playerHandUnclickable
  )
}

const updateUI = (
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler: MouseEvent,
  playerHandUnclickable?: MouseEvent
) =>
  dispatchGameAction({
    type: "UPDATE",
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    playerHandUnclickable,
  })

export const startGame = (shuffledDeck: card[]) => {
  const playerHand = deck.dealHand(shuffledDeck, 7)
  const opponentHand = deck.dealHand(shuffledDeck, 7)

  const playerPairs = initialPairs(playerHand)
  const opponentPairs = initialPairs(opponentHand)

  const log = (
    <p class="game__log">
      The cards have been dealt. Any initial pairs of cards have been added to
      your Pairs. <br /> Please select a card from your hand to request a match
      with your opponent.
    </p>
  )

  const playerTurnHandler = (cardImg: MouseEvent) =>
    player.playerTurnHandler(
      cardImg,
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction,
      setGameDeck,
      opponentTurn
    )

  const opponentTurn = () =>
    opponent.opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction
    )

  updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler
  )
  dispatchGameAction({ type: "GAME_LOG", log })
}

export const gameOver = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI,
  dispatchGameAction
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
    playerHandUnclickable(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI
    )
    dispatchGameAction({ type: "GAME_OVER" })
    return true
  }
}

export default {
  initialPairs,
  createPairsUI,
  playerHandUnclickable,
  updateUI,
  startGame,
  gameOver,
}
