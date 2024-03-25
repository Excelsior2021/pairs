import Card from "../gameObjects/Card"
import Deck from "../gameObjects/Deck"
import Player from "../gameObjects/Player"
import Opponent from "../gameObjects/Opponent"
import Game from "../gameObjects/Game"
import { playerRequest } from "./general"

//DECK FUNCTIONS
export type gameDeckHandlerType = (
  playerHandEvent: MouseEvent,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

export type gameDeckHandlerMultiplayerType = (
  shuffledDeck: Card[],
  playerRequest: playerRequest
) => void

//PLAYER FUNCTIONS
export type playerMatchType = (
  playerHandEvent: MouseEvent,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => number | boolean | undefined

export type playerDealtType = (
  playerHandEvent: MouseEvent,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => number | undefined

export type playerTurnHandlerType = (
  playerHandEvent: MouseEvent,
  game: Game,
  deck: Deck,
  player: Player,
  opponent: Opponent
) => void

export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: MouseEvent,
  player: Player | null,
  clientPlayer: number
) => void

export type playerTurnHandlerFactory = (playerHandEvent: MouseEvent) => void

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
  oppenentRequest: playerRequest,
  player: Player,
  clientPlayer: number
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
