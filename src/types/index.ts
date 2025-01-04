export * from "./multiplayer-events"
import type { Accessor, Setter } from "solid-js"
import type { Socket, io as ioType } from "socket.io-client"
import type { Deck, Game, Player, Opponent } from "@game-objects"
import type {
  GameAction,
  GameMode,
  nonNumCardValue,
  suit,
  PlayerID as PlayerIDEnum,
  PlayerOutput,
} from "@enums"

export type card = {
  id: string
  value: nonNumCardValue | number | null
  suit: suit | ""
  img: string
}

export type createGameHandler = (
  io: typeof ioType,
  setSocket: Setter<Socket | null>,
  setSessionID: Setter<string>,
  setPlayerID: Setter<PlayerIDEnum | null>,
  setMultiplayerMenu: Setter<boolean>,
  setMultiplayerSessionStarted: Setter<boolean>,
  setConnecting: Setter<boolean>,
  setServerConnected: Setter<false | null>,
  PlayerID: typeof PlayerIDEnum
) => void

export type joinSessionHandler = (
  sessionID: string,
  io: typeof ioType,
  setSocket: Setter<Socket | null>,
  setPlayerID: Setter<PlayerIDEnum | null>,
  setJoinGameMenu: Setter<boolean>,
  setMultiplayerSessionStarted: Setter<boolean>,
  setSessionIDNotValid: Setter<boolean>,
  setNoSessionExists: Setter<boolean>,
  setServerConnected: Setter<boolean | null>,
  setLoading: Setter<boolean>,
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

export type gameStateType = {
  gameMode: GameMode
  game?: Game | null
  deck?: Deck | null
  player?: Player | null
  opponent?: Opponent | Player | null
  playerTurnHandlerFactory?: ((playerHandEvent: MouseEvent) => void) | null
  isPlayerTurn: boolean
  isOpponentTurn: boolean
  playerResponseHandlerFactory?: ((hasCard: boolean) => void) | null
  playerDealsHandlerFactory?: ((playerRequest: playerRequest) => void) | null
  isDealFromDeck: boolean
  playerOutput: PlayerOutput | null
  opponentRequest?: card | null
  log: string
  outcome: string
  gameOver: boolean
  deckCount: number | null
}

export type gameStateMultiplayer = Omit<
  gameStateType,
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

export type gameStateProp = Accessor<gameStateType | gameStateMultiplayer>

export type gameAction = {
  action: GameAction
  game?: Game
  deck?: Deck
  player?: Player
  opponent?: Opponent
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
}

export type gameActionMultiplayer = Omit<
  gameAction,
  "deck" | "opponentRequest"
> & {
  deck?: card[]
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
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

export type dispatchAction = (action: gameAction) => void

export type dispatchActionMultiplayer = (action: gameActionMultiplayer) => void

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
