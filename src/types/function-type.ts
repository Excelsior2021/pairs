import { Setter } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { card, gameAction } from "./general"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerDealt: playerDealtType,
  cardImg: null,
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
  cardImg: null,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler: Function,
  updateUI: Function
) => number

export type playerTurnHandlerType = (
  cardImg: null,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  playerTurnHandler: Function,
  updateUI,
  dispatchGameAction: ({}: gameAction) => void,
  setGameDeck: Setter<JSX.EventHandlerUnion<HTMLImageElement, MouseEvent>>,
  opponentTurn: Function
) => void
