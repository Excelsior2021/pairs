import { Show, type Component, type Setter } from "solid-js"
import { createStore, produce, reconcile } from "solid-js/store"
import { deck } from "@assets"
import Game from "@components/game/game"
import Sidebar from "@components/sidebar/sidebar"
import CreateGame from "@components/create-game/create-game"
import PairsModal from "@components/pairs-modal/pairs-modal"
import QuitGameModal from "@components/quit-game-modal/quit-game-modal"
import PlayerModal from "@components/player-modal/player-modal"
import { GameController } from "@game-controller"
import {
  playerDeals,
  playerResponse,
  playerTurn,
} from "@multiplayer-event-functions"
import { singlePlayerReducer } from "./single-player-lib"
import { multiplayerReducer, startSession } from "./multiplayer-lib"
import {
  Action,
  GameMode,
  PlayerModalHeading,
  PlayerModalSubHeading,
  PlayerOutput,
  type PlayerID,
} from "@enums"
import type {
  action,
  playerRequest,
  multiplayerConfig,
  sessionState,
} from "@types"

import "@components/session/session.scss"

type props = {
  multiplayerConfig: multiplayerConfig
  gameMode: GameMode
  setGameMode: Setter<null>
  showPairsModal: boolean
  showQuitGameModal: boolean
  setShowPairsModal: Setter<boolean>
  setShowInstructions: Setter<boolean>
  setShowQuitGameModal: Setter<boolean>
}

const Session: Component<props> = props => {
  const initialSessionState = {
    player: { hand: [], pairs: [] },
    opponent: { hand: [], pairs: [] },
    isPlayerTurn: false,
    isOpponentTurn: false,
    playerOutput: null,
    log: "",
    outcome: "",
    gameOver: false,
    isDealFromDeck: false,
    deckCount: null,
    gameStartedMultiplayer: false,
    playerID: null,
    socket: props.multiplayerConfig.socket,
    sessionID: props.multiplayerConfig.sessionID,
    playerTurn: null,
    showPlayerModal: false,
    playerModalHeading: null,
    playerModalSubHeading: null,
    opponentRequest: null,
  } as sessionState

  const [sessionState, setState] = createStore(initialSessionState)

  let handleAction: (action: action) => void
  let playerTurnHandler: (playerHandEvent: MouseEvent) => void
  let playerResponseHandler: (hasCard: boolean) => void
  let playerDealsHandler: (() => void) | null
  let playerDisconnectHandler: (() => void) | undefined
  const closePlayerModalHandler = () =>
    handleAction({
      type: Action.CLOSE_PLAYER_MODAL,
    })

  if (props.gameMode === GameMode.SinglePlayer) {
    handleAction = (action: action) =>
      singlePlayerReducer(action, setState, reconcile)

    const game = new GameController(deck, handleAction)

    game.start()

    playerTurnHandler = game.playerTurnHandler
    playerResponseHandler = game.playerResponseHandler
    playerDealsHandler = game.playerDealsHandler
  }

  if (props.gameMode === GameMode.Multiplayer) {
    handleAction = (action: action) =>
      multiplayerReducer(action, setState, produce)

    playerTurnHandler = chosenCard =>
      playerTurn(
        chosenCard,
        sessionState.player,
        sessionState.playerID as PlayerID,
        handleAction,
        Action
      )

    playerResponseHandler = hasCard =>
      playerResponse(
        hasCard,
        sessionState.opponentRequest as playerRequest,
        sessionState.player,
        sessionState.playerID as PlayerID,
        handleAction,
        Action
      )

    playerDealsHandler = () =>
      playerDeals(
        sessionState.playerRequest as playerRequest,
        handleAction,
        Action
      )

    playerDisconnectHandler = () => props.multiplayerConfig.socket?.disconnect()

    if (props.multiplayerConfig.socket && props.multiplayerConfig.playerID)
      startSession(
        props.multiplayerConfig.socket,
        props.multiplayerConfig.playerID,
        handleAction
      )
  }

  return (
    <div class="session">
      <Show
        when={
          props.gameMode === GameMode.SinglePlayer ||
          sessionState.gameStartedMultiplayer
        }
        fallback={<CreateGame sessionID={props.multiplayerConfig.sessionID} />}>
        <Game
          player={sessionState.player}
          opponent={sessionState.opponent}
          isPlayerTurn={sessionState.isPlayerTurn!}
          isOpponentTurn={sessionState.isOpponentTurn}
          log={sessionState.log}
          gameOver={sessionState.gameOver}
          outcome={sessionState.outcome}
          deckCount={sessionState.deckCount}
          playerTurnHandler={playerTurnHandler!}
          playerResponseHandler={playerResponseHandler!}
        />

        <PlayerModal
          player={sessionState.player}
          playerOutput={sessionState.playerOutput as PlayerOutput}
          showPlayerModal={sessionState.showPlayerModal}
          playerModalHeading={
            sessionState.playerModalHeading as PlayerModalHeading
          }
          playerModalSubHeading={
            sessionState.playerModalSubHeading as PlayerModalSubHeading
          }
          closePlayerModalHandler={closePlayerModalHandler!}
        />
        <PairsModal
          player={sessionState.player}
          opponent={sessionState.opponent}
          showPairsModal={props.showPairsModal}
          setShowPairsModal={props.setShowPairsModal}
        />
      </Show>
      <Sidebar
        isDealFromDeck={sessionState.isDealFromDeck}
        gameMode={props.gameMode}
        playerDealsHandler={playerDealsHandler!}
        setShowPairsModal={props.setShowPairsModal}
        setShowInstructions={props.setShowInstructions}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
      <QuitGameModal
        multiplayerConfig={props.multiplayerConfig}
        setGameMode={props.setGameMode}
        playerDisconnectHandler={playerDisconnectHandler}
        showQuitGameModal={props.showQuitGameModal}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
    </div>
  )
}

export default Session
