import { joinGameHandler as joinGameHandlerType } from "@/types"

export const joinGameHandler: joinGameHandlerType = async (
  sessionID,
  io,
  connectToServer,
  setSocket,
  setJoinGame,
  setMultiplayerSessionStarted,
  setSessionIDNotValid,
  setNoSessionExists,
  setServerConnected,
  setLoading,
  dispatchGameAction,
  GameAction
) => {
  setSessionIDNotValid(false)
  setNoSessionExists(false)
  setServerConnected(null)

  if (sessionID.length !== 4) {
    setSessionIDNotValid(true)
    return
  }

  setLoading(true)

  const socket = await connectToServer(io, 5000, 200)

  if (socket.connected) {
    setSocket(socket)
    setLoading(false)
    setSessionIDNotValid(false)
    setNoSessionExists(false)
    setServerConnected(true)

    socket.emit("join_session", sessionID)

    socket.on("no_sessionID", () => {
      setNoSessionExists(true)
      socket.disconnect()
    })

    socket.on("sessionID_exists", () => {
      dispatchGameAction({ type: GameAction.JOIN_SESSION, sessionID })
      setJoinGame(false)
      setMultiplayerSessionStarted(true)
    })

    return
  } else {
    setServerConnected(false)
    setLoading(false)
    socket.disconnect()
  }
}
