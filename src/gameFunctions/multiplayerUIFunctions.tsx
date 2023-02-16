import { For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { card } from "../types/general"
import { gameDeckUI, dealCard } from "./deckFunctions"
import cardBack from "../assets/cards/back.png"

export const createPlayerHandUI = (
  hand: card[],
  cardHandler: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
) => (
  <For each={hand}>
    {(card: card) => (
      <img
        id={card.id}
        class="card card--player"
        src={`./src/assets/cards/${card.id}.png`}
        alt={card.id}
        onclick={cardHandler}
      />
    )}
  </For>
)

export const createHandUI = (hand: card[]) => (
  <For each={hand}>
    {(card: card) => (
      <img
        class="card"
        id={card.id}
        src={`./src/assets/cards/${card.id}.png`}
        alt={card.id}
      />
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
      <img
        id={card.id}
        class="card"
        src={`./src/assets/cards/${card.id}.png`}
        alt={card.id}
      />
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
  gameDeckUI,
  createPlayerHandUI,
  createHandUI,
  createHandUIback,
  createPairsUI,
  gameDeckHandler,
}
