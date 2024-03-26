import { dispatchGameAction } from "../components/Session/Session"
import { gameDeckHandlerType } from "../types/function-types"
import { PlayerOutput } from "../types/enums"

export const gameDeckHandler: gameDeckHandlerType = (
  playerHandEvent,
  game,
  deck,
  player,
  opponent
) => {
  const playerOutput = player.dealt(
    playerHandEvent,
    game,
    deck,
    player,
    opponent,
    dispatchGameAction
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    player,
  })

  if (
    playerOutput === PlayerOutput.HandMatch ||
    playerOutput === PlayerOutput.NoMatch
  )
    opponent.turn(game, deck, player, dispatchGameAction)

  game.end(deck, player, opponent, dispatchGameAction)
}

export default {
  gameDeckHandler,
}
