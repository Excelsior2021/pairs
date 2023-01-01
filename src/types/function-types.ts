import { JSX } from "solid-js/jsx-runtime"
import { card } from "./general"
import { playerHandEventType } from "./general"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerHandEvent: playerHandEventType,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => void

//PLAYER FUNCTIONS
export type playerMatchType = (
  playerHandEvent: playerHandEventType,
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  shuffledDeck: card[]
) => number | boolean | undefined

export type playerDealtType = (
  playerHandEvent: playerHandEventType,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => number | undefined

export type playerTurnHandlerType = (
  playerHandEvent: playerHandEventType,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => void

export type playerResponseHandlerType = (
  response: MouseEvent & {
    currentTarget: HTMLButtonElement
    target: Element
  },
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked: card,
  playerAnswerHandler: playerAnswerHandlerType,
  yesButton: JSX.Element,
  noButton: JSX.Element
) => void

export type playerAnswerHandlerType = (
  playerHandEvent: playerHandEventType,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked: card
) => void

//OPPONENT FUNCTIONS
export type opponentMatchType = (
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsk: card,
  playerHandEvent: playerHandEventType,
  shuffledDeck: card[]
) => void

export type opponentDealtType = (
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsk: card
) => number | undefined

export type opponentTurnType = (
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => void

//PAIRS FUNCTIONS
export type updateUIType = (
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  shuffledDeck: card[],
  playerHandUnclickable?: boolean
) => void

export type gameOverType = (
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => boolean | void

//GAME REPORT

export type gameReportType = (
  deck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => void
