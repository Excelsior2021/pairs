import { Show, type Component } from "solid-js"
import { createReducer } from "@utils"
import Game from "@components/game/game"
import Sidebar from "@components/sidebar/sidebar"
import CreateGame from "@components/create-game/create-game"
import PairsModal from "@components/pairs-modal/pairs-modal"
import QuitGameModal from "@components/quit-game-modal/quit-game-modal"
import PlayerModal from "@components/player-modal/player-modal"
import {
  initialSessionState,
  multiplayerReducer,
  startSession,
} from "./component-lib"
import "@components/session/session.scss"

import type { Socket } from "socket.io-client"
import { GameAction, type PlayerID } from "@enums"
import {
  playerDeals,
  playerDisconnect,
  playerResponse,
  playerTurn,
} from "@multiplayer-event-functions"

export const [sessionState, dispatchAction] = createReducer(
  multiplayerReducer,
  initialSessionState
)

type props = {
  socket: Socket | null
  sessionID: string
  playerID: PlayerID | null
}

const MultiplayerSession: Component<props> = props => {
  if (props.socket && props.playerID) startSession(props.socket, props.playerID)

  return (
    <div class="session">
      <Show
        when={sessionState().gameStarted}
        fallback={<CreateGame sessionID={props.sessionID} />}>
        <Game
          player={sessionState().player!}
          opponent={sessionState().opponent!}
          isPlayerTurn={sessionState().isPlayerTurn!}
          isOpponentTurn={sessionState().isOpponentTurn}
          log={sessionState().log}
          gameOver={sessionState().gameOver}
          outcome={sessionState().outcome}
          deckCount={sessionState().deckCount}
          playerTurnHandler={chosenCard =>
            playerTurn(
              chosenCard,
              sessionState().player,
              sessionState().playerID,
              dispatchAction,
              GameAction
            )
          }
          playerResponseHandler={hasCard =>
            playerResponse(
              hasCard,
              sessionState().opponentRequest,
              sessionState().player,
              sessionState().playerID,
              dispatchAction,
              GameAction
            )
          }
        />
        <PlayerModal
          player={sessionState().player}
          playerOutput={sessionState().playerOutput}
        />
        <PairsModal
          player={sessionState().player}
          opponent={sessionState().opponent}
        />
      </Show>
      <Sidebar
        isDealFromDeck={sessionState().isDealFromDeck}
        gameMode={sessionState().gameMode}
        playerDealsHandler={() =>
          playerDeals(sessionState().playerRequest, dispatchAction, GameAction)
        }
      />
      <QuitGameModal
        playerDisconnect={() => playerDisconnect(dispatchAction, GameAction)}
      />
    </div>
  )
}

export default MultiplayerSession
