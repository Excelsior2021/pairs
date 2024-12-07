import { joinGameHandler as joinGameHandlerType } from "@types"

export const joinGameHandler: joinGameHandlerType = async (
  sessionID,
  io,
  setSocket,
  setJoinGameMenu,
  setMultiplayerSessionStarted,
  setSessionIDNotValid,
  setNoSessionExists,
  setServerConnected,
  setConnecting
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
    setMultiplayerSessionStarted(true)
  })
}
