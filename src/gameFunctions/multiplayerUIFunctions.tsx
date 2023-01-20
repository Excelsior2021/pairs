import { For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { card } from "../types/general"
import cardBack from "../assets/cards/back.png"
import cardImages from "../assets/cards/cardImages"

export const createDeck = () => {
  const deck: card[] = []
  const non_num_cards = ["ace", "jack", "queen", "king"]
  const suits = ["clubs", "diamonds", "hearts", "spades"]

  for (const x of [...Array(9).keys()]) {
    for (const suit of suits) {
      const id = `${x + 2}_of_${suit}`
      const img = cardImages[`_${id}`]
      deck.push({
        id,
        value: x + 2,
        suit,
        img,
      })
    }
  }

  for (const value of non_num_cards) {
    if (value !== "ace") {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        const img = cardImages[`_${id}`]
        deck.push({
          id,
          value,
          suit,
          img,
        })
      }
    }
  }

  for (const suit of suits.reverse()) {
    const id = `ace_of_${suit}`
    const img = cardImages[`_${id}`]
    deck.unshift({
      id,
      value: "ace",
      suit,
      img,
    })
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

const dealCard = (deck: card[]) => deck.shift()

export const createPlayerHandUI = (
  hand: card[],
  cardHandler: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
) => (
  <For each={hand}>
    {(card: card) => (
      <img
        id={card.id}
        class="card card--player"
        src={cardImages[card.img]}
        alt={card.id}
        onclick={cardHandler}
      />
    )}
  </For>
)

export const createHandUI = (hand: card[]) => (
  <For each={hand}>
    {(card: card) => (
      <img class="card" id={card.id} src={cardImages[card.img]} alt={card.id} />
    )}
  </For>
)

export const createHandUIback = (hand: card[]) => (
  <For each={hand}>
    {() => <img class="card" src={cardBack} alt="opponent card" />}
  </For>
)

export const createPairsUI = (pairs: card[]) => (
  <For each={pairs}>
    {card => (
      <img id={card.id} class="card" src={cardImages[card.img]} alt={card.id} />
    )}
  </For>
)

export const gameDeckHandler = (shuffledDeck, playerRequest) => {
  const dealtCard = dealCard(shuffledDeck)

  dispatchGameAction({
    type: "PLAYER_DEALT",
    dealtCard,
    playerRequest,
  })

  setGameDeck(gameDeckUI())
}

export default {
  createDeck,
  gameDeckUI,
  createPlayerHandUI,
  createHandUI,
  createHandUIback,
  createPairsUI,
  gameDeckHandler,
}
