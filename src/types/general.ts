import { Accessor } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { Socket } from "socket.io-client"
import { playerTurnHandlerType } from "./function-types"
import Card from "../gameObjects/Card"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"
import Deck from "../gameObjects/Deck"
import Game from "../gameObjects/Game"
import { GameMode } from "./enums"

export type playerHandEventType = PointerEvent | null

export type gameStateProp = {
  gameState: Accessor<gameStateType>
}

export type handProp = {
  heading: string
  hand: Card[]
  player: boolean
  playerTurnHandler: playerHandEventType
}

export type multiplayerSessionProps = {
  socket: Socket
}

export type quitGameModalProps = {
  multiplayer: boolean
  socket: Socket | null
}

export type gameStateType = {
  gameMode: GameMode.SinglePlayer | GameMode.Multiplayer
  game?: Game | null
  deck?: Deck | null
  player?: Player | null
  opponent?: Opponent | Player | null
  playerHandClickable?: boolean
  playerTurnHandler: playerTurnHandlerType | null
  playerChosenCardEvent?: playerHandEventType | null
  playerOutput: number | null
  opponentTurn: boolean
  opponentRequest?: Card | null
  playerRequest?: number
  log: string
  outcome: string
  gameOver: boolean
  deckClickable: boolean
  //multiplayer
  shuffledDeck?: Card[] | null
  socket?: Socket
  clientPlayer?: number
  sessionID?: string | undefined
  gameState?: clientStateMutiplayer | null
  playerTurn?: number | null
}

export type gameAction = {
  type: string
  game?: Game
  deck?: Deck
  player?: Player
  opponent?: Opponent
  playerHandClickable?: boolean
  playerTurnHandlerWrapper?: (playerHandEvent: playerHandEventType) => void
  playerChosenCardEvent?: playerHandEventType
  playerOutput?: number | boolean
  opponentTurn?: boolean
  opponentRequest?: Card | null
  log?: string
  chosenCard?: Card
  opponentAsked?: Card
  outcome?: string
  gameOver?: boolean | undefined
  deckClickable?: boolean
}

export type gameActionMultiplayer = {
  type: string
  player?: Player
  opponent?: Player
  shuffledDeck?: Card[]
  playerHandClickable?: boolean
  playerTurnHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerAnswerHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerOutput?: number | boolean
  opponentRequest?: Card | null
  log?: string
  chosenCard?: Card
  opponentAsked?: Card
  socket?: Socket
  clientPlayer?: number
  sessionID?: string
  serverState?: serverStateMultiplayer
  playerTurn?: number
  player1Log?: string
  player2Log?: string
  playerRequest?: number
  // opponentRequest?: cardRequestMultiplayer
  playerCard?: cardRequestMultiplayer
  requestPlayer?: number
  dealtCard?: Card
}

export type cardRequestMultiplayer = {
  card: Card
  player: number
}

export type serverStateMultiplayer = {
  player1: Player
  player2: Player
  shuffledDeck: Card[]
}

export type clientStateMutiplayer = {
  player: Player
  opponent: Player
  shuffledDeck: Card[]
}
