import { For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import playerFunctions from "./playerFunctions"
import opponentFunctions from "./opponentFunctions"
import pairs from "./pairsFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { playerHandEventType } from "../types/general"
import { gameDeckHandlerType } from "../types/function-types"
import Card from "../gameObjects/Card"
import { PlayerOutput } from "../types/enums"

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
  deck,
  player,
  opponent
) => {
  const playerOutput = playerFunctions.playerDealt(
    playerHandEvent,
    deck,
    player,
    opponent
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    player,
  })

  dispatchGameAction({ type: "GAME_LOG" })

  deck.deckUI()

  if (
    playerOutput === PlayerOutput.HandMatch ||
    playerOutput === PlayerOutput.NoMatch
  ) {
    opponentFunctions.opponentTurn(deck, player, opponent)
  }

  pairs.gameOver(deck, player, opponent)
}

export default {
  gameDeckUI,
  createPlayerHandUI,
  createHandUI,
  createHandUIback,
  gameDeckHandler,
}
