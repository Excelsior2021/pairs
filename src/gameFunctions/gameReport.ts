import { gameReportType } from "../types/function-types"

const gameReport: gameReportType = (
  deck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs
) => {
  console.log("deck: ", deck)
  console.log("playerHand: ", playerHand)
  console.log("opponentHand: ", opponentHand)
  console.log("playerPairs: ", playerPairs)
  console.log("opponentPairs: ", opponentPairs)
  console.log("\n")
}

export default gameReport
