import { Show, type Component, type Setter } from "solid-js"
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
import { GameAction, GameMode, type PlayerID } from "@enums"
import "@components/session/session.scss"

import type { Socket } from "socket.io-client"
import {
  playerDeals,
  playerDisconnect,
  playerResponse,
  playerTurn,
} from "@multiplayer-event-functions"

type props = {
  socket: Socket | null
  sessionID: string
  playerID: PlayerID | null
  showPairsModal: boolean
  showQuitGameModal: boolean
  setSessionStarted: Setter<boolean>
  setMultiplayerSessionStarted: Setter<boolean>
  setShowPairsModal: Setter<boolean>
  setShowInstructions: Setter<boolean>
  setShowQuitGameModal: Setter<boolean>
}

const MultiplayerSession: Component<props> = props => {
  const [sessionState, dispatchAction] = createReducer(
    multiplayerReducer,
    initialSessionState
  )

  if (props.socket && props.playerID)
    startSession(props.socket, props.playerID, dispatchAction)

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
          showPairsModal={props.showPairsModal}
          setShowPairsModal={props.setShowPairsModal}
        />
      </Show>
      <Sidebar
        isDealFromDeck={sessionState().isDealFromDeck}
        gameMode={GameMode.Multiplayer}
        playerDealsHandler={() =>
          playerDeals(sessionState().playerRequest, dispatchAction, GameAction)
        }
        setShowPairsModal={props.setShowPairsModal}
        setShowInstructions={props.setShowInstructions}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
      <QuitGameModal
        playerDisconnect={() => playerDisconnect(dispatchAction, GameAction)}
        showQuitGameModal={props.showQuitGameModal}
        setSessionStarted={props.setSessionStarted}
        setMultiplayerSessionStarted={props.setMultiplayerSessionStarted}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
    </div>
  )
}

export default MultiplayerSession
