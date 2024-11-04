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
  connectToServer,
  setSocket,
  setCreateSessionID,
  setMultiplayerMenu,
  setMultiplayerSessionStarted,
  setServerTimeout,
  setServerConnected,
  UITimer,
  setUITimer,
  dispatchGameAction,
  GameAction
) => {
  setServerTimeout(false)
  setServerConnected(false)

  const UITimerIntervalRef = setInterval(() => {
    if (UITimer() > 0) setUITimer((prev: number) => prev - 1)
    else clearInterval(UITimerIntervalRef)
  }, 1000)

  const socket = await connectToServer(io, 60000, 200)

  if (socket.connected) {
    setSocket(socket)
    setServerConnected(true)
    const sessionIDGenerator = () => Math.floor(Math.random() * 10 ** 4)
    const sessionID = sessionIDGenerator().toString().padStart(4, "0")

    setCreateSessionID(sessionID)

    socket.emit("recieve_sessionID")

    socket.on("recieved_sessionID", () => {
      setMultiplayerMenu(false)
      setMultiplayerSessionStarted(true)
      dispatchGameAction({
        type: GameAction.CREATE_SESSION,
        sessionID,
      })
    })
  } else {
    setServerTimeout(true)
    socket.disconnect()
  }
}
