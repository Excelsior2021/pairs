import type {
  createGameHandler as createGameHandlerType,
  terminateCreateSession as terminateCreateSessionType,
} from "@types"

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
  setConnecting,
  setServerConnected
) => {
  setConnecting(true)

  const socket = io(import.meta.env.VITE_SERVER_DOMAIN, {
    reconnectionAttempts: 4,
  })

  setSocket(socket)

  socket.on("connect", () => {
    setServerConnected(null)
    setConnecting(false)
    const sessionID = Math.floor(Math.random() * 10 ** 4)
      .toString()
      .padStart(4, "0")

    setCreateSessionID(sessionID)

    socket.emit("create_session", sessionID)

    setMultiplayerMenu(false)
    setMultiplayerSessionStarted(true)
  })

  socket.io.on("reconnect_failed", () => {
    setConnecting(false)
    setServerConnected(false)
  })
}
