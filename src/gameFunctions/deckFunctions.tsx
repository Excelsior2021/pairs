import { For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import player from "./playerFunctions"
import opponent from "./opponentFunctions"
import pairs from "./pairsFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { playerHandEventType } from "../types/general"
import { gameDeckHandlerType } from "../types/function-types"
import { Card } from "../store/classes"
import { PlayerOutput } from "../types/enums"

export const createDeck = () => {
  const deck: Card[] = new Array(52)
  const non_num_cards = ["ace", "jack", "queen", "king"]
  const suits = ["clubs", "diamonds", "hearts", "spades"]
  let deckIndex = 0

  for (const value of non_num_cards) {
    for (const suit of suits) {
      const id = `${value}_of_${suit}`
      const img = `./cards/${id}.png`
      deck[deckIndex] = new Card(id, value, suit, img)
      deckIndex++
    }
  }

  for (let value = 2; value < 11; value++) {
    for (const suit of suits) {
      const id = `${value}_of_${suit}`
      const img = `./cards/${id}.png`
      deck[deckIndex] = new Card(id, value, suit, img)
      deckIndex++
    }
  }

  return deck
}

export const gameDeckUI = (
  gameDeckHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
) => (
  <img
    class="card card--deck"
    src={`./cards/back.png`}
    alt="game deck"
    onclick={gameDeckHandler}
  />
)

export const shuffleDeck = (deck: Card[]) => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

export const dealCard = (deck: Card[]) => deck.pop()

export const dealHand = (deck: Card[], handSize: number) => {
  const hand: Card[] = new Array(handSize)
  for (let i = 0; i < handSize; i++) hand[i] = dealCard(deck)!
  return hand
}

export const createPlayerHandUI = (
  hand: Card[],
  cardHandler: (playerHandEvent: playerHandEventType) => void
) => (
  <For each={hand}>
    {card => (
      <img
        class="card card--player"
        id={card.id}
        src={card.img}
        alt={card.id}
        onclick={e => cardHandler(e)}
      />
    )}
  </For>
)

export const createHandUI = (hand: Card[]) => (
  <For each={hand}>
    {(card: Card) => (
      <img class="card" id={card.id} src={card.img} alt={card.id} />
    )}
  </For>
)

export const createHandUIback = (hand: Card[]) => (
  <For each={hand}>
    {() => <img class="card" src={`./cards/back.png`} alt="opponent card" />}
  </For>
)

export const gameDeckHandler: gameDeckHandlerType = (
  playerHandEvent,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  const playerOutput = player.playerDealt(
    playerHandEvent,
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    playerHand,
    playerPairs,
  })

  dispatchGameAction({ type: "GAME_LOG" })

  setGameDeck(gameDeckUI())

  if (
    playerOutput === PlayerOutput.HandMatch ||
    playerOutput === PlayerOutput.NoMatch
  ) {
    opponent.opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )
  }

  pairs.gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs
  )
}

export default {
  createDeck,
  gameDeckUI,
  shuffleDeck,
  dealCard,
  dealHand,
  createPlayerHandUI,
  createHandUI,
  createHandUIback,
  gameDeckHandler,
}
