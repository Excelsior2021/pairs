import type { Accessor, Setter } from "solid-js"
import type { Socket, io as ioType } from "socket.io-client"
import type { Deck, Game, Player, Opponent } from "@game-objects"
import type { GameAction, GameMode, nonNumCardValue, suit } from "@enums"

type card = {
  id: string
  value: nonNumCardValue | number | null
  suit: suit | ""
  img: string
}

export type createGameHandler = (
  io: typeof ioType,
  setSocket: Setter<Socket | null>,
  setCreateSessionID: Setter<string>,
  setMultiplayerMenu: Setter<boolean>,
  setMultiplayerSessionStarted: Setter<boolean>,
  setConnecting: Setter<boolean>,
  setServerConnected: Setter<false | null>
) => void

export type joinGameHandler = (
  sessionID: string,
  io: typeof ioType,
  setSocket: Setter<Socket | null>,
  setJoinGameMenu: Setter<boolean>,
  setMultiplayerSessionStarted: Setter<boolean>,
  setSessionIDNotValid: Setter<boolean>,
  setNoSessionExists: Setter<boolean>,
  setServerConnected: Setter<boolean | null>,
  setLoading: Setter<boolean>
) => void

export type terminateCreateSession = (
  socket: Socket | null,
  setMultiplayerMenu: Setter<boolean>
) => void

export type playerRequest = {
  card: card
  clientPlayer: number
}

export type gameStateType = {
  gameMode: GameMode
  game?: Game | null
  deck?: Deck | null
  player?: Player | null
  opponent?: Opponent | Player | null
  playerTurnHandlerFactory?: ((playerHandEvent: MouseEvent) => void) | null
  playerHandClickable?: boolean
  playerResponseHandlerFactory?: ((hasCard: boolean) => void) | null
  deckHandlerFactory?: (() => void) | null
  deckClickable: boolean
  playerOutput: number | null
  opponentTurn: boolean
  opponentRequest?: card | null
  playerRequest?: playerRequest
  log: string
  outcome: string
  gameOver: boolean
}

export type gameStateMultiplayer = Omit<gameStateType, "deck"> & {
  deck?: card[] | null
  socket?: Socket | null
  clientPlayer?: number
  sessionID?: string | undefined
  gameState?: clientStateMutiplayer | null
  playerTurn?: number | null
  opponentRequestMultiplayer?: playerRequest | null
}

export type gameStateProp = Accessor<gameStateType | gameStateMultiplayer>

export type gameAction = {
  action: GameAction
  game?: Game
  deck?: Deck
  player?: Player
  opponent?: Opponent
  playerTurnHandlerFactory?: (playerHandEvent: MouseEvent) => void
  playerHandClickable?: boolean
  playerResponseHandlerFactory?: (hasCard: boolean) => void
  deckHandlerFactory?: () => void
  deckClickable?: boolean
  playerOutput?: number | boolean
  opponentTurn?: boolean
  opponentRequest?: card | null
  log?: string
  chosenCard?: card
  opponentAsked?: card
  outcome?: string
  gameOver?: boolean
}

export type gameActionMultiplayer = Omit<gameAction, "deck"> & {
  deck?: card[]
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
  playerCard?: playerRequest
  opponentRequestMultiplayer?: playerRequest | null
  socket?: Socket | null
  clientPlayer?: number
  sessionID?: string
  serverState?: serverStateMultiplayer
  playerTurn?: number
  player1Log?: string
  player2Log?: string
  playerRequest?: playerRequest
  activePlayer?: number
  dealtCard?: card
}

export type dispatchGameActionType = (action: gameAction) => void

export type dispatchGameActionMultiplayerType = (
  action: gameActionMultiplayer
) => void

export type serverStateMultiplayer = {
  player1: Player
  player2: Player
  deck: card[]
}

export type clientStateMutiplayer = {
  player: Player
  opponent: Player
  deck: card[]
}

//PLAYER FUNCTIONS
export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: MouseEvent,
  player: Player | null,
  clientPlayer: number,
  dispatchGAmeAction: dispatchGameActionMultiplayerType
) => void

export type playerResponseHandlerMultiplayerType = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: Player,
  clientPlayer: number,
  dispatchGAmeAction: dispatchGameActionMultiplayerType
) => void
