import type { Action as GameActionEnum, PlayerID } from "@enums"
import type { handleAction, player, playerRequest } from "@types"

export type playerTurn = (
  playerHandEvent: MouseEvent,
  player: player,
  playerID: PlayerID,
  dispatchGAmeAction: handleAction,
  Action: typeof GameActionEnum
) => void

export type playerResponse = (
  hasCard: boolean,
  oppenentRequest: playerRequest,
  player: player,
  playerID: number,
  handleAction: handleAction,
  Action: typeof GameActionEnum
) => void
