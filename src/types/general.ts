import { Accessor } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { Socket } from "socket.io-client"
import {
  playerTurnHandlerType,
  playerAnswerHandlerType,
} from "./function-types"

export type card = {
  id: string
  value: string | number
  suit: string
  img: string
}

export type playerHandEventType = JSX.EventHandlerUnion<
  HTMLImageElement,
  MouseEvent
> & {
  target: Element
}

export type gameStateProp = {
  gameState: Accessor<gameStateType>
}

export type gameStateMultiplayerProp = {
  gameState: Accessor<gameStateMultiplayerType>
}

export type multiplayerSessionProps = {
  socket: Socket
}

export type quitGameModalProps = {
  multiplayer: boolean
  socket: Socket | null
}

export type gameStateType = {
  playerHandUI: JSX.Element
  playerPairsUI: JSX.Element
  opponentHandUI: JSX.Element
  opponentPairsUI: JSX.Element
  playerHandUnclickable: boolean | null
  playerTurnHandler: playerTurnHandlerType | null
  playerAnswerHandler: playerAnswerHandlerType | null
  playerOutput: number | boolean | null
  question: JSX.Element | null
  yesButton: JSX.Element | null
  noButton: JSX.Element | null
  log: JSX.Element | null
  playerHandLast: JSX.Element
  playerPairsLast: JSX.Element
  playerPairsSecondLast: JSX.Element
}

export type gameStateMultiplayerType = {
  playerHandUI: JSX.Element
  playerPairsUI: JSX.Element
  opponentHandUI: JSX.Element
  opponentPairsUI: JSX.Element
  shuffledDeck: card[]
  playerHand: card[]
  opponentHand: card[]
  playerPairs: card[]
  opponentPairs: card[]
  playerHandUnclickable: boolean | null
  playerTurnHandler: playerTurnHandlerType | null
  playerAnswerHandler: playerAnswerHandlerType | null
  playerOutput: number | boolean | null
  question: JSX.Element | null
  yesButton: JSX.Element
  noButton: JSX.Element
  log: JSX.Element | null
  socket: Socket
  clientPlayer: string
  sessionID: string | undefined
  gameState: serverStateMultiplayer | null
  playerHandLast: JSX.Element
  playerPairsLast: JSX.Element
  playerPairsSecondLast: JSX.Element
}

export type gameAction = {
  type: string
  playerHand?: card[]
  playerPairs?: card[]
  opponentHand?: card[]
  opponentPairs?: card[]
  playerHandUnclickable?: boolean
  playerTurnHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerAnswerHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerOutput?: number | boolean
  question?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
  chosenCard?: card
  opponentAsked?: card
}

export type gameActionMultiplayer = {
  type: string
  playerHand?: card[]
  playerPairs?: card[]
  opponentHand?: card[]
  opponentPairs?: card[]
  playerHandUnclickable?: boolean
  playerTurnHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerAnswerHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerOutput?: number | boolean
  question?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
  chosenCard?: card
  opponentAsked?: card
  socket?: Socket
  clientPlayer?: string
  sessionID?: string
  serverState?: serverStateMultiplayer
  playerTurn?: string
  player1Log?: string
  player2Log?: string
  playerRequest?: cardRequestMultiplayer
  opponentRequest?: cardRequestMultiplayer
  playerCard?: card
  requestPlayer?: string
  dealtCard?: card
}

export type cardRequestMultiplayer = {
  card: card
  player: string
}

export type serverStateMultiplayer = {
  player1Hand: card[]
  player1Pairs: card[]
  player2Hand: card[]
  player2Pairs: card[]
  shuffledDeck: card[]
}

export type clickEventHandlerType = MouseEvent & {
  currentTarget: HTMLButtonElement
  target: Element
}
