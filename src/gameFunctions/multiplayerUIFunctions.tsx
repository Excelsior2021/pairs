import { For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { gameDeckHandlerMultiplayerType } from "../types/function-types"
import { gameDeckUI } from "./deckFunctions"
import Card from "../gameObjects/Card"

export const createPlayerHandUI = (
  hand: Card[],
  cardHandler: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
) => (
  <For each={hand}>
    {card => (
      <img
        id={card.id}
        class="card card--player"
        src={`./cards/${card.id}.png`}
        alt={card.id}
        onclick={cardHandler}
      />
    )}
  </For>
)

export const createHandUI = (hand: Card[]) => (
  <For each={hand}>
    {(card: Card) => (
      <img
        class="card"
        id={card.id}
        src={`./cards/${card.id}.png`}
        alt={card.id}
      />
    )}
  </For>
)

export const createHandUIback = (hand: Card[]) => (
  <For each={hand}>
    {() => <img class="card" src={`./cards/back.png`} alt="opponent card" />}
  </For>
)

export const createPairsUI = (pairs: Card[]) => (
  <For each={pairs}>
    {card => (
      <img
        id={card.id}
        class="card"
        src={`./cards/${card.id}.png`}
        alt={card.id}
      />
    )}
  </For>
)

export const gameDeckHandler: gameDeckHandlerMultiplayerType = (
  shuffledDeck,
  playerRequest
) => {
  const dealtCard = shuffledDeck.pop()

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
