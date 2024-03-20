import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"
import { cardRequestMultiplayer } from "../types/general"

export const gameDeckHandler = (playerRequest: cardRequestMultiplayer) =>
  dispatchGameAction({
    type: "PLAYER_DEALT",
    playerRequest,
  })
