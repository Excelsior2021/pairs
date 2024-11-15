import type {
  createGameHandler as createGameHandlerType,
  terminateCreateSession as terminateCreateSessionType,
} from "@/types"

export const terminateCreateSession: terminateCreateSessionType = (
  socket,
  setMultiplayerMenu
) => {
  setMultiplayerMenu(false)
  socket?.disconnect()
}

export const createGameHandler: createGameHandlerType = async (
  io,
  setSocket,
  setCreateSessionID,
  setMultiplayerMenu,
  setMultiplayerSessionStarted,
  setConnectError,
  setServerConnected
) => {
  setConnectError(false)
  setServerConnected(false)

  const socket = io(import.meta.env.VITE_SERVER_DOMAIN)

  socket.on("connect", () => {
    setSocket(socket)
    setServerConnected(true)
    const sessionID = Math.floor(Math.random() * 10 ** 4)
      .toString()
      .padStart(4, "0")

    setCreateSessionID(sessionID)

    socket.emit("create_session", sessionID)

    setMultiplayerMenu(false)
    setMultiplayerSessionStarted(true)
  })

  socket.on("connect_error", error => {
    /* handle reconnection attempts */
    setConnectError(true)
  })
}
