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

//PLAYER FUNCTIONS
export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: MouseEvent,
  player: Player | null,
  clientPlayer: number
) => void

export type playerTurnHandlerFactory = (playerHandEvent: MouseEvent) => void

export type playerResponseHandlerMultiplayerType = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: Player,
  clientPlayer: number
) => void
