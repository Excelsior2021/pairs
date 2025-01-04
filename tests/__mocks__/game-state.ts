import { GameMode } from "@enums"

export const singlePlayerGamestate = {
  gameMode: GameMode.SinglePlayer,
  game: null,
  deck: null,
  player: null,
  opponent: null,
  playerTurnHandlerFactory: null,
  isPlayerTurn: false,
  playerResponseHandlerFactory: null,
  deckHandlerFactory: null,
  deckClickable: false,
  playerOutput: null,
  opponentTurn: false,
  opponentRequest: null,
  log: "",
  outcome: "",
  gameOver: false,
}

export const multiplayerSessionState = {
  gameMode: GameMode.Multiplayer,
  player: null,
  opponent: null,
  deck: null,
  playerTurnHandlerFactory: null,
  playerOutput: null,
  log: "",
  outcome: "",
  socket: null,
  playerID: 0,
  sessionID: "",
  sessionState: null,
  opponentTurn: false,
  isPlayerTurn: null,
  gameOver: false,
  deckClickable: false,
}
