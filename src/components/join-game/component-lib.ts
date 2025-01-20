import { joinSessionHandler as joinSessionHandlerType } from "@types"

export const joinSessionHandler: joinSessionHandlerType = async (
  sessionID,
  io,
  multiplayerConfig,
  setGameMode,
  setJoinGameMenu,
  setSessionIDNotValid,
  setNoSessionExists,
  setServerConnected,
  setConnecting,
  GameMode,
  PlayerID
) => {
  setSessionIDNotValid(false)
  setNoSessionExists(false)
  setServerConnected(null)

  if (sessionID.length !== 4) {
    setSessionIDNotValid(true)
    return
  }

  setConnecting(true)

  const socket = io(import.meta.env.VITE_SERVER_DOMAIN, {
    reconnectionAttempts: 4,
  })

  multiplayerConfig.socket = socket

  socket.on("connect", () => {
    setConnecting(false)
    setSessionIDNotValid(false)
    setNoSessionExists(false)
    setServerConnected(true)

    socket.emit("join_session", sessionID)
    multiplayerConfig.playerID = PlayerID.P2
  })

  socket.io.on("reconnect_failed", () => {
    setServerConnected(false)
    setConnecting(false)
  })

  socket.on("no_sessionID", () => {
    setNoSessionExists(true)
    socket.disconnect()
  })

  socket.on("sessionID_exists", sessionID => {
    multiplayerConfig.sessionID = sessionID
    setJoinGameMenu(false)
    setGameMode(GameMode.Multiplayer)
  })
}
