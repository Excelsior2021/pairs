import type { io } from "@/types"

export const connectToServer = async (
  io: io,
  tTimeout: number,
  tInterval: number
) => {
  let socket = io(import.meta.env.VITE_SERVER_DOMAIN)
  let timeout: NodeJS.Timeout, interval: NodeJS.Timeout
  socket = await new Promise(res => {
    timeout = setTimeout(() => {
      clearInterval(interval)
      res(socket)
    }, tTimeout)
    interval = setInterval(() => {
      if (socket.connected) {
        clearTimeout(timeout)
        clearInterval(interval)
        res(socket)
      }
    }, tInterval)
  })

  return socket
}
