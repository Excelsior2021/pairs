import { For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import player from "./playerFunctions"
import opponent from "./opponentFunctions"
import pairs from "./pairsFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { card } from "../types/general"
import cardBack from "../assets/cards/back.png"
import { gameDeckHandlerType } from "../types/function-types"
import cardImages from "../assets/cards/cardImages"

export const createDeck = () => {
  const deck: card[] = []
  const non_num_cards = ["ace", "jack", "queen", "king"]
  const suits = ["clubs", "diamonds", "hearts", "spades"]

  for (const suit of suits) {
    const id = `ace_of_${suit}`
    const img = `./cards/${id}.png`
    deck.push({
      id,
      value: "ace",
      suit,
      img,
    })
  }

  for (let value = 2; value < 11; value++) {
    for (const suit of suits) {
      const id = `${value}_of_${suit}`
      const img = `./cards/${id}.png`
      deck.push({
        id,
        value,
        suit,
        img,
      })
    }
  }

  for (const value of non_num_cards) {
    if (value !== "ace") {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        const img = `./cards/${id}.png`
        deck.push({
          id,
          value,
          suit,
          img,
        })
      }
    }
  }

  return deck
}

export const gameDeckUI = (
  gameDeckHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
) => (
  <img
    class="card card--deck"
    src={cardBack}
    alt="game deck"
    onclick={gameDeckHandler}
  />
)

export const shuffleDeck = (deck: card[]) => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

export const dealCard = (deck: card[]) => deck.pop()

export const dealHand = (deck: card[], handSize: number) => {
  const hand: card[] = []
  while (hand.length < handSize) hand.push(dealCard(deck)!)

  return hand
}

export const createPlayerHandUI = (
  hand: card[],
  cardHandler: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
) => (
  <For each={hand}>
    {(card: card) => (
      <img
        id={card.id}
        class="card card--player"
        src={card.img}
        alt={card.id}
        onclick={cardHandler}
      />
    )}
  </For>
)

export const createHandUI = (hand: card[]) => (
  <For each={hand}>
    {(card: card) => (
      <img class="card" id={card.id} src={card.img} alt={card.id} />
    )}
  </For>
)

export const createHandUIback = (hand: card[]) => (
  <For each={hand}>
    {() => <img class="card" src={cardBack} alt="opponent card" />}
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
  })

  dispatchGameAction({ type: "GAME_LOG" })

  setGameDeck(gameDeckUI())

  if (playerOutput === 2 || playerOutput === 3) {
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
