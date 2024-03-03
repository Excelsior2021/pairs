import { JSX } from "solid-js/jsx-runtime"
import { card, cardRequestMultiplayer } from "./general"
import { playerHandEventType } from "./general"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerHandEvent: playerHandEventType,
  deck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => void

export type gameDeckHandlerMultiplayerType = (
  deck: card[],
  playerRequest: cardRequestMultiplayer
) => void

//PLAYER FUNCTIONS
export type playerMatchType = (
  playerHandEvent: playerHandEventType,
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  deck: card[]
) => number | boolean | undefined

export type playerDealtType = (
  playerHandEvent: playerHandEventType,
  deck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => number | undefined

export type playerTurnHandlerType = (
  playerHandEvent: playerHandEventType,
  deck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => void

export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: playerHandEventType,
  playerHand: card[],
  player: number
) => void

export type playerResponseHandlerType = (
  hasCard: boolean,
  deck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked: card,
  yesButton: JSX.Element,
  noButton: JSX.Element
) => void

export type playerResponseHandlerMultiplayerType = (
  hasCard: boolean,
  oppenentRequest: cardRequestMultiplayer,
  playerHand: card[],
  player: number
) => void

//OPPONENT FUNCTIONS
export type opponentDealtType = (
  deck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsk: card
) => number | undefined

export type opponentTurnType = (
  deck: card[],
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
  deck: card[],
  playerHandUnclickable?: boolean
) => void

export type gameOverType = (
  deck: card[],
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
