export * from "./multiplayer-events"
import type { Accessor, Setter } from "solid-js"
import type { Socket, io as ioType } from "socket.io-client"
import type {
  Action,
  NonNumCardValue,
  Suit,
  PlayerID as PlayerIDEnum,
  PlayerOutput,
  GameMode as GameModeEnum,
  PlayerModalHeading,
  PlayerModalSubHeading,
} from "@enums"

export type card = {
  id: string
  value: NonNumCardValue | number | null
  suit: Suit | ""
  img: string
}

export type player = {
  hand: card[]
  pairs: card[]
}

export type createGameHandler = (
  io: typeof ioType,
  setSocket: Setter<Socket | null>,
  setSessionID: Setter<string>,
  setPlayerID: Setter<PlayerIDEnum | null>,
  setMultiplayerMenu: Setter<boolean>,
  setGameMode: Setter<GameModeEnum>,
  setConnecting: Setter<boolean>,
  setServerConnected: Setter<false | null>,
  GameMode: typeof GameModeEnum,
  PlayerID: typeof PlayerIDEnum
) => void

export type joinSessionHandler = (
  sessionID: string,
  io: typeof ioType,
  setSocket: Setter<Socket | null>,
  setPlayerID: Setter<PlayerIDEnum | null>,
  setJoinGameMenu: Setter<boolean>,
  setGameMode: Setter<GameModeEnum>,
  setSessionIDNotValid: Setter<boolean>,
  setNoSessionExists: Setter<boolean>,
  setServerConnected: Setter<boolean | null>,
  setLoading: Setter<boolean>,
  GameMode: typeof GameModeEnum,
  PlayerID: typeof PlayerIDEnum
) => void

export type terminateCreateSession = (
  socket: Socket | null,
  setMultiplayerMenu: Setter<boolean>
) => void

export type playerRequest = {
  card: card
  playerID: number
}

export type sessionState = {
  player?: player | null
  opponent?: player | null
  isPlayerTurn: boolean
  isOpponentTurn: boolean
  isDealFromDeck: boolean
  playerOutput: PlayerOutput | null
  opponentRequest?: card | null
  log: string
  outcome: string
  gameOver: boolean
  deckCount: number | null
  showPlayerModal: boolean
  playerModalHeading: PlayerModalHeading
  playerModalSubHeading: PlayerModalSubHeading
}

export type sessionStateMultiplayer = Omit<
  sessionState,
  "deck" | "opponentRequest"
> & {
  gameStarted: boolean
  playerID?: number | null
  deck?: card[] | null
  socket?: Socket | null
  sessionID?: string | undefined
  playerTurn?: number | null
  playerRequest?: playerRequest
  opponentRequest?: playerRequest | null
}

export type sessionStateProp = Accessor<sessionState | sessionStateMultiplayer>

export type action = {
  type: Action
  player?: player
  opponent?: player
  isPlayerTurn?: boolean
  isOpponentTurn?: boolean
  isDealFromDeck?: boolean
  playerOutput?: PlayerOutput
  opponentRequest?: card | null
  log?: string
  chosenCard?: card
  opponentAsked?: card
  outcome?: string
  gameOver?: boolean
  deckCount?: number
}

export type actionMultiplayer = Omit<action, "deck" | "opponentRequest"> & {
  deck?: card[]
  playerCard?: playerRequest
  opponentRequest?: playerRequest | null
  socket?: Socket | null
  playerID?: number | null
  sessionID?: string
  serverState?: serverStateMultiplayer
  playerTurn?: number
  player1Log?: string
  player2Log?: string
  playerRequest?: playerRequest
  activePlayer?: number
  dealtCard?: card
}

export type handleAction = (action: action) => void

export type handleActionMultiplayer = (action: actionMultiplayer) => void

export type serverStateMultiplayer = {
  player1: player
  player2: player
  deck: card[]
}

export type clientStateMutiplayer = {
  player: player
  opponent: player
  deck: card[]
}
