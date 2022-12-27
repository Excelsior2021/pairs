import { Setter } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { card, gameAction } from "./general"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerDealt: playerDealtType,
  playerHandEvent: null,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler: Function,
  updateUI: Function,
  dispatchGameAction: ({}: gameAction) => void,
  setGameDeck: Setter<JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>>
) => void

//PLAYER FUNCTIONS
export type playerDealtType = (
  playerHandEvent: null,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler: Function,
  updateUI: Function
) => number

export type playerTurnHandlerType = (
  playerHandEvent: null,
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
