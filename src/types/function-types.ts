import Player from "../game-objects/player"
import { playerRequest } from "./general"

//PLAYER FUNCTIONS
export type playerTurnHandlerMultiplayerType = (
  playerHandEvent: MouseEvent,
  player: Player | null,
  clientPlayer: number
) => void

export type playerResponseHandlerMultiplayerType = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: Player,
  clientPlayer: number
) => void
