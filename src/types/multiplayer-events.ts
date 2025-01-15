import type { Action as GameActionEnum, PlayerID } from "@enums"
import type { Player } from "@game-objects"
import type { handleActionMultiplayer, playerRequest } from "@types"

export type playerTurn = (
  playerHandEvent: MouseEvent,
  player: Player | null,
  playerID: PlayerID,
  dispatchGAmeAction: handleActionMultiplayer,
  Action: typeof GameActionEnum
) => void

export type playerResponse = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: Player,
  playerID: number,
  handleAction: handleActionMultiplayer,
  Action: typeof GameActionEnum
) => void

export type playerDeals = (
  playerRequest: playerRequest,
  handleAction: handleActionMultiplayer,
  Action: typeof GameActionEnum
) => void

export type playerDisconnects = (
  handleAction: handleActionMultiplayer,
  Action: typeof GameActionEnum
) => void
