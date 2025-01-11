import { joinSessionHandler as joinSessionHandlerType } from "@types"

export const joinSessionHandler: joinSessionHandlerType = async (
  sessionID,
  io,
  setSocket,
  setPlayerID,
  setJoinGameMenu,
  setGameMode,
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

  setSocket(socket)

  socket.on("connect", () => {
    setConnecting(false)
    setSessionIDNotValid(false)
    setNoSessionExists(false)
    setServerConnected(true)

    socket.emit("join_session", sessionID)
    setPlayerID(PlayerID.P2)
  })

  socket.io.on("reconnect_failed", () => {
    setServerConnected(false)
    setConnecting(false)
  })

  socket.on("no_sessionID", () => {
    setNoSessionExists(true)
    socket.disconnect()
  })

  socket.on("sessionID_exists", () => {
    setJoinGameMenu(false)
    setGameMode(GameMode.Multiplayer)
  })
}
