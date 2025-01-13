import { Show, type Component, type Setter } from "solid-js"
import { createReducer } from "@utils"
import Game from "@components/game/game"
import Sidebar from "@components/sidebar/sidebar"
import CreateGame from "@components/create-game/create-game"
import PairsModal from "@components/pairs-modal/pairs-modal"
import QuitGameModal from "@components/quit-game-modal/quit-game-modal"
import PlayerModal from "@components/player-modal/player-modal"
import {
  deckObj,
  Deck,
  Game as GameObject,
  Player,
  Opponent,
} from "@game-objects"
import {
  playerDeals,
  playerDisconnects,
  playerResponse,
  playerTurn,
} from "@multiplayer-event-functions"
import { singlePlayerReducer } from "./single-player-lib"
import { multiplayerReducer, startSession } from "./multiplayer-lib"
import { Action, GameMode, type PlayerID } from "@enums"
import type { Socket } from "socket.io-client"
import "@components/session/session.scss"
import {
  action,
  actionMultiplayer,
  sessionState,
  sessionStateMultiplayer,
} from "@types"

type props = {
  gameMode: GameMode
  socket: Socket | null
  sessionID: string
  playerID: PlayerID | null
  showPairsModal: boolean
  showQuitGameModal: boolean
  setGameMode: Setter<null>
  setShowPairsModal: Setter<boolean>
  setShowInstructions: Setter<boolean>
  setShowQuitGameModal: Setter<boolean>
}

const Session: Component<props> = props => {
  const initialSessionState = {
    game: null,
    player: null,
    opponent: null,
    deck: null,
    opponentRequest: null,
    isPlayerTurn: false,
    isOpponentTurn: false,
    playerOutput: null,
    log: "",
    outcome: "",
    gameOver: false,
    isDealFromDeck: false,
    deckCount: null,
    gameStarted: null,
    playerID: null,
    socket: null,
    sessionID: "",
    playerTurn: null,
    showPlayerModal: false,
    playerModalHeading: "",
    playerModalSubHeading: "",
  }

  let reducer:
    | ((state: sessionState, action: action) => sessionState)
    | ((
        state: sessionStateMultiplayer,
        action: actionMultiplayer
      ) => sessionStateMultiplayer)

  if (props.gameMode === GameMode.SinglePlayer)
    reducer = singlePlayerReducer as (
      state: sessionState,
      action: action
    ) => sessionState

  if (props.gameMode === GameMode.Multiplayer)
    reducer = multiplayerReducer as (
      state: sessionStateMultiplayer,
      action: actionMultiplayer
    ) => sessionStateMultiplayer

  const [sessionState, dispatchAction] = createReducer(
    reducer!,
    initialSessionState
  )

  let playerTurnHandler: (playerHandEvent: MouseEvent) => void
  let playerResponseHandler: (hasCard: boolean) => void
  let playerDealsHandler: (() => void) | null
  let playerDisconnectHandler: (() => void) | undefined
  const closePlayerModalHandler = () =>
    dispatchAction({
      type: Action.CLOSE_PLAYER_MODAL,
    })

  if (props.gameMode === GameMode.SinglePlayer) {
    const deck = new Deck(deckObj, dispatchAction)
    const player = new Player(dispatchAction)
    const opponent = new Opponent(dispatchAction)
    const game = new GameObject(deck, player, opponent, dispatchAction)

    game.start()

    playerTurnHandler = game.playerTurnHandler
    playerResponseHandler = game.playerResponseHandler
    playerDealsHandler = game.playerDealsHandler
  }
  if (props.gameMode === GameMode.Multiplayer) {
    playerTurnHandler = chosenCard =>
      playerTurn(
        chosenCard,
        sessionState().player,
        sessionState().playerID,
        dispatchAction,
        Action
      )

    playerResponseHandler = hasCard =>
      playerResponse(
        hasCard,
        sessionState().opponentRequest,
        sessionState().player,
        sessionState().playerID,
        dispatchAction,
        Action
      )

    playerDealsHandler = () =>
      playerDeals(sessionState().playerRequest, dispatchAction, Action)

    playerDisconnectHandler = () => playerDisconnects(dispatchAction, Action)

    if (props.socket && props.playerID)
      startSession(props.socket, props.playerID, dispatchAction)
  }

  return (
    <div class="session">
      <Show
        when={
          props.gameMode === GameMode.SinglePlayer || sessionState().gameStarted
        }
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
          playerTurnHandler={playerTurnHandler!}
          playerResponseHandler={playerResponseHandler!}
        />
        <PlayerModal
          player={sessionState().player}
          playerOutput={sessionState().playerOutput}
          showPlayerModal={sessionState().showPlayerModal}
          playerModalHeading={sessionState().playerModalHeading}
          playerModalSubHeading={sessionState().playerModalSubHeading}
          closePlayerModalHandler={closePlayerModalHandler}
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
        gameMode={props.gameMode}
        playerDealsHandler={playerDealsHandler!}
        setShowPairsModal={props.setShowPairsModal}
        setShowInstructions={props.setShowInstructions}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
      <QuitGameModal
        playerDisconnectHandler={playerDisconnectHandler}
        showQuitGameModal={props.showQuitGameModal}
        setGameMode={props.setGameMode}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
    </div>
  )
}

export default Session
