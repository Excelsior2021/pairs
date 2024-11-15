import { joinGameHandler as joinGameHandlerType } from "@/types"

export const joinGameHandler: joinGameHandlerType = async (
  sessionID,
  io,
  setSocket,
  setJoinGameMenu,
  setMultiplayerSessionStarted,
  setSessionIDNotValid,
  setNoSessionExists,
  setServerConnected,
  setLoading
) => {
  setSessionIDNotValid(false)
  setNoSessionExists(false)
  setServerConnected(null)

  if (sessionID.length !== 4) {
    setSessionIDNotValid(true)
    return
  }

  setLoading(true)

  const socket = io(import.meta.env.VITE_SERVER_DOMAIN)

  socket.on("connect", () => {
    setSocket(socket)
    setLoading(false)
    setSessionIDNotValid(false)
    setNoSessionExists(false)
    setServerConnected(true)

    socket.emit("join_session", sessionID)
  })

  socket.on("connect_error", error => {
    /* handle reconnection attempts */
    setServerConnected(false)
    setLoading(false)
    // socket.disconnect()
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
