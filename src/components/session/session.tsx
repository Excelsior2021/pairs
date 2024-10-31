import { createReducer } from "@solid-primitives/memo"
import Game from "@/components/game/game"
import Sidebar from "@/components/sidebar/sidebar"
import PlayerModal from "@/components/player-modal/player-modal"
import PairsModal from "@/components/pairs-modal/pairs-modal"
import QuitGameModal from "@/components/quit-game-modal/quit-game-modal"
import {
  Card,
  Deck,
  Game as GameObject,
  Player,
  Opponent,
} from "@/game-objects"
import { gameReducer, initialGameState } from "./component-lib"
import "./session.scss"

import type { Component } from "solid-js"

const Session: Component = () => {
  const [gameState, dispatchGameAction] = createReducer(
    gameReducer,
    initialGameState
  )

  const deck = new Deck(Card, dispatchGameAction)
  const player = new Player(dispatchGameAction)
  const opponent = new Opponent(dispatchGameAction)
  const game = new GameObject(deck, player, opponent, dispatchGameAction)

  game.start()

  return (
    <div class="session">
      <Game gameState={gameState} />
      <Sidebar gameState={gameState} />
      <PlayerModal gameState={gameState} />
      <PairsModal gameState={gameState} />
      <QuitGameModal multiplayer={false} socket={null} />
    </div>
  )
}

export default Session
