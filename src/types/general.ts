import { Accessor } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
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

export type gameStateType = {
  playerHandUI: () => JSX.ArrayElement
  playerHand2UI: () => JSX.ArrayElement
  playerPairsUI: () => JSX.ArrayElement
  opponentHandUI: () => JSX.ArrayElement
  opponentPairsUI: () => JSX.ArrayElement
  playerHandUnclickable?: boolean
  playerTurnHandler?: playerTurnHandlerType
  playerAnswerHandler?: playerAnswerHandlerType
  playerOutput?: number | boolean
  question?: JSX.Element
  yesButton?: HTMLButtonElement
  noButton?: HTMLButtonElement
  log?: JSX.Element
}

export type gameAction = {
  type: string
  playerHand?: card[]
  playerPairs?: card[]
  opponentHand?: card[]
  opponentPairs?: card[]
  playerHandUnclickable?: boolean
  playerTurnHandler?:
    | JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
    | playerTurnHandlerType
  playerAnswerHandler?:
    | JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
    | playerAnswerHandlerType
  playerOutput?: number | boolean
  question?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
  chosenCard?: card
  opponentAsked?: card
}
