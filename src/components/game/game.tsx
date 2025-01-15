import { createEffect, Show, type Component } from "solid-js"
import Hand from "@components/hand/hand"
import GameActions from "@components/game-actions/game-actions"
import GameOver from "@components/game-over/game-over"
import "./game.scss"

import type { player } from "@types"

type props = {
  player: player
  opponent: player
  isPlayerTurn: boolean
  isOpponentTurn: boolean
  log: string
  gameOver: boolean
  outcome: string
  deckCount: number | null
  playerTurnHandler: (playerHandEvent: MouseEvent) => void
  playerResponseHandler: (hasCard: boolean) => void
}

const Game: Component<props> = props => {
  createEffect(() => {
    console.log(props.deckCount)
  })
  return (
    <div class="game">
      <Hand heading="Opponent Hand" hand={props.opponent!.hand} />
      <div class="game__console">
        <Show
          when={!props.gameOver}
          fallback={
            <GameOver
              outcome={props.outcome}
              playerPairsCount={props.player!.pairs.length}
              opponentPairsCount={props.opponent!.pairs.length}
              deckCount={props.deckCount}
            />
          }>
          {props.log}
          <Show when={props.isOpponentTurn} fallback={null}>
            <GameActions playerResponseHandler={props.playerResponseHandler} />
          </Show>
        </Show>
      </div>
      <Hand
        heading="Your Hand"
        hand={props.player.hand}
        isPlayer={true}
        isPlayerTurn={props.isPlayerTurn}
        playerTurnHandler={props.playerTurnHandler}
      />
    </div>
  )
}
export default Game
