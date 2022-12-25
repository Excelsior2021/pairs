import { Accessor } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"

export type card = {
  id: string
  value: string | number
  suit: string
  img: string
}

export type gameStateProp = {
  gameState: Accessor<gameStateType>
}

export type gameStateType = {
  playerHandState: { data: card[]; UI: () => JSX.ArrayElement } | null
  playerHandState2: { data: card[]; UI: () => JSX.ArrayElement } | null
  playerPairsState: { data: card[]; UI: () => JSX.ArrayElement } | null
  opponentHandState: { data: card[]; UI: () => JSX.ArrayElement } | null
  opponentPairsState: { data: card[]; UI: () => JSX.ArrayElement } | null
  playerTurnHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerHandUnclickable?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerAnswerHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerOutput?: number | boolean
  question?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
}

export type gameAction = {
  type: string
  playerHand?: card[]
  playerPairs?: card[]
  opponentHand?: card[]
  opponentPairs?: card[]
  playerTurnHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerHandUnclickable?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerAnswerHandler?: JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>
  playerOutput?: number | boolean
  question?: JSX.Element
  yesButton?: JSX.Element
  noButton?: JSX.Element
  log?: JSX.Element
}

export type dispatchGameActionType
