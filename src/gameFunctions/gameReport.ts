import { gameReportType } from "../types/function-types"

const gameReport: gameReportType = (deck, player, opponent) => {
  console.log("deck: ", deck)
  console.log("playerHand: ", player.hand)
  console.log("opponentHand: ", opponent.hand)
  console.log("playerPairs: ", player.pairs)
  console.log("opponentPairs: ", opponent.pairs)
  console.log("\n")
}

export default gameReport
