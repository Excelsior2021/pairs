import { cardRequestMultiplayer } from "./general"
import { playerHandEventType } from "./general"
import Card from "../gameObjects/Card"
import Deck from "../gameObjects/Deck"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"
import Game from "../gameObjects/Game"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerHandEvent: playerHandEventType,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

export type gameDeckHandlerMultiplayerType = (
  shuffledDeck: Card[],
  playerRequest: cardRequestMultiplayer
) => void

//PLAYER FUNCTIONS
export type playerMatchType = (
  playerHandEvent: playerHandEventType,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => number | boolean | undefined

export type playerDealtType = (
  playerHandEvent: playerHandEventType,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => number | undefined

export type playerTurnHandlerType = (
  playerHandEvent: playerHandEventType,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: playerHandEventType,
  player: Player,
  clientPlayer: number
) => void

export type playerResponseHandlerType = (
  hasCard: boolean,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent,
  opponentRequest: Card
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
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

//PAIRS FUNCTIONS
export type updateUIType = (
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent,
  playerHandClickable?: boolean
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
