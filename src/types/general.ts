import { Accessor } from "solid-js"
import { Socket } from "socket.io-client"
import Card from "../gameObjects/Card"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"
import Deck from "../gameObjects/Deck"
import Game from "../gameObjects/Game"
import { GameMode } from "./enums"

export type gameStateProp = {
  gameState: Accessor<gameStateType>
}

export type handProp = {
  heading: string
  hand: Card[]
  player?: boolean
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
  gameMode?: string
}

export type multiplayerSessionProps = {
  socket: Socket
}

export type quitGameModalProps = {
  multiplayer: boolean
  socket: Socket | null
}

export type playerRequest = {
  card: Card
  clientPlayer: number
}

export type gameStateType = {
  gameMode: GameMode.SinglePlayer | GameMode.Multiplayer
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
  opponentRequest?: Card | null
  opponentRequestMultiplayer?: playerRequest | null
  playerRequest?: playerRequest
  log: string
  outcome: string
  gameOver: boolean
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
  playerTurnHandlerFactory?: (playerHandEvent: MouseEvent) => void
  playerHandClickable?: boolean
  playerResponseHandlerFactory?: (hasCard: boolean) => void
  deckHandlerFactory?: () => void
  deckClickable?: boolean
  playerOutput?: number | boolean
  opponentTurn?: boolean
  opponentRequest?: Card | null
  log?: string
  chosenCard?: Card
  opponentAsked?: Card
  outcome?: string
  gameOver?: boolean
}

export type gameActionMultiplayer = {
  type: string
  player?: Player
  opponent?: Player
  shuffledDeck?: Card[]
  playerHandClickable?: boolean
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
  playerOutput?: number | boolean
  playerCard?: playerRequest
  opponentRequestMultiplayer?: playerRequest | null
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
  playerRequest?: playerRequest
  requestPlayer?: number
  dealtCard?: Card
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
