import { Accessor } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { Socket } from "socket.io-client"
import { playerTurnHandlerType } from "./function-types"
import Card from "../gameObjects/Card"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"
import Deck from "../gameObjects/Deck"

export type playerHandEventType = MouseEvent & {
  currentTarget: HTMLImageElement
  target: Element
}

export type gameStateProp = {
  gameState: Accessor<gameStateType>
}

export type gameStateMultiplayerProp = {
  gameState: Accessor<gameStateMultiplayerType>
}

export type handProp = {
  heading: string
  hand: Card[]
  player: boolean
}

export type multiplayerSessionProps = {
  socket: Socket
}

export type quitGameModalProps = {
  multiplayer: boolean
  socket: Socket | null
}

export type gameStateType = {
  playerHand: Card[]
  playerPairs: Card[]
  opponentHand: Card[]
  opponentPairs: Card[]
  playerHandClickable: boolean | null
  playerTurnEventHandler: playerTurnHandlerType | null
  playerOutput: number | null
  opponentRequest: JSX.Element | null
  yesButton: JSX.Element | null
  noButton: JSX.Element | null
  log: JSX.Element | null
  playerHandLast: JSX.Element
  playerPairsLastTwo: JSX.Element
}

export type gameStateMultiplayerType = {
  playerHandUI: JSX.Element
  playerPairsUI: JSX.Element
  opponentHandUI: JSX.Element
  opponentPairsUI: JSX.Element
  shuffledDeck: Card[]
  playerHand: Card[]
  opponentHand: Card[]
  playerPairs: Card[]
  opponentPairs: Card[]
  playerHandClickable: boolean | null
  playerTurnHandler: playerTurnHandlerType | null
  playerOutput: number | null
  opponentRequest: JSX.Element | null
  yesButton: JSX.Element
  noButton: JSX.Element
  log: JSX.Element | null
  socket: Socket
  clientPlayer: number
  sessionID: string | undefined
  gameState: serverStateMultiplayer | null
  playerHandLast: JSX.Element
  playerPairsLastTwo: JSX.Element
}

export type gameAction = {
  type: string
  deck?: Deck
  player?: Player
  opponent?: Opponent
  playerHandClickable?: boolean
  playerTurnEventHandler?: (playerHandEvent: playerHandEventType) => void
  playerOutput?: number | boolean
  opponentRequest?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
  chosenCard?: Card
  opponentAsked?: Card
}

export type gameActionMultiplayer = {
  type: string
  playerHand?: Card[]
  playerPairs?: Card[]
  opponentHand?: Card[]
  opponentPairs?: Card[]
  playerHandClickable?: boolean
  playerTurnHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerAnswerHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerOutput?: number | boolean
  opponentRequest?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
  chosenCard?: Card
  opponentAsked?: Card
  socket?: Socket
  clientPlayer?: number
  sessionID?: string
  serverState?: serverStateMultiplayer
  playerTurn?: number
  player1Log?: string
  player2Log?: string
  playerRequest?: cardRequestMultiplayer
  opponentRequest?: cardRequestMultiplayer
  playerCard?: cardRequestMultiplayer
  requestPlayer?: number
  dealtCard?: Card
}

export type cardRequestMultiplayer = {
  card: Card
  player: number
}

export type serverStateMultiplayer = {
  player1Hand: Card[]
  player1Pairs: Card[]
  player2Hand: Card[]
  player2Pairs: Card[]
  shuffledDeck: Card[]
}
