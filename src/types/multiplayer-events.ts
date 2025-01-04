import type { GameAction as GameActionEnum, PlayerID } from "@enums"
import type { Player } from "@game-objects"
import type { dispatchActionMultiplayer, playerRequest } from "@types"

export type playerTurn = (
  playerHandEvent: MouseEvent,
  player: Player | null,
  playerID: PlayerID,
  dispatchGAmeAction: dispatchActionMultiplayer,
  GameAction: typeof GameActionEnum
) => void

export type playerResponse = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: Player,
  playerID: number,
  dispatchAction: dispatchActionMultiplayer,
  GameAction: typeof GameActionEnum
) => void

export type playerDeals = (
  playerRequest: playerRequest,
  dispatchAction: dispatchActionMultiplayer,
  GameAction: typeof GameActionEnum
) => void

export type playerDisconnects = (
  dispatchAction: dispatchActionMultiplayer,
  GameAction: typeof GameActionEnum
) => void
