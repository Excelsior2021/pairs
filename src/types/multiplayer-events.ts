import type { Action as GameActionEnum, PlayerID } from "@enums"
import type { handleActionMultiplayer, player, playerRequest } from "@types"

export type playerTurn = (
  playerHandEvent: MouseEvent,
  player: player | null,
  playerID: PlayerID,
  dispatchGAmeAction: handleActionMultiplayer,
  Action: typeof GameActionEnum
) => void

export type playerResponse = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: player,
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
