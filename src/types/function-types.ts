import { JSX } from "solid-js/jsx-runtime"
import { cardRequestMultiplayer } from "./general"
import { playerHandEventType } from "./general"
import Card from "../gameObjects/Card"
import Deck from "../gameObjects/Deck"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerHandEvent: playerHandEventType,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

export type gameDeckHandlerMultiplayerType = (
  deck: Deck,
  playerRequest: cardRequestMultiplayer
) => void

//PLAYER FUNCTIONS
export type playerMatchType = (
  playerHandEvent: playerHandEventType,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => number | boolean | undefined

export type playerDealtType = (
  playerHandEvent: playerHandEventType,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => number | undefined

export type playerTurnHandlerType = (
  playerHandEvent: playerHandEventType,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: playerHandEventType,
  playerHand: Card[],
  player: number
) => void

export type playerResponseHandlerType = (
  hasCard: boolean,
  deck: Deck,
  player: Player,
  opponent: Opponent,
  opponentAsked: Card,
  yesButton: JSX.Element,
  noButton: JSX.Element
) => void

export type playerResponseHandlerMultiplayerType = (
  hasCard: boolean,
  oppenentRequest: cardRequestMultiplayer,
  playerHand: Card[],
  player: number
) => void

//OPPONENT FUNCTIONS
export type opponentDealtType = (
  deck: Deck,
  player: Player,
  opponent: Opponent,
  opponentAsk: Card
) => number | undefined

export type opponentTurnType = (
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

//PAIRS FUNCTIONS
export type updateUIType = (
  deck: Deck,
  player: Player,
  opponent: Opponent,
  playerHandUnclickable?: boolean
) => void

export type gameOverType = (
  deck: Deck,
  player: Player,
  opponent: Opponent
) => boolean | void

//GAME REPORT

export type gameReportType = (
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void
