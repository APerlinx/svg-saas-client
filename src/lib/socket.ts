import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

function getSocketOrigin() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  if (apiBase.startsWith('http')) return new URL(apiBase).origin
  return window.location.origin
}

export function getSocket() {
  if (!socket) {
    socket = io(getSocketOrigin(), {
      withCredentials: true,
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export function disconnectSocket() {
  if (!socket) return
  socket.disconnect()
}

export function setupSocket() {
  connectSocket()
}

export function waitForSocketConnected(
  socket: Socket,
  timeoutMs = 8000
): Promise<void> {
  if (socket.connected) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const onConnect = () => {
      cleanup()
      resolve()
    }
    const onError = (err: Error) => {
      cleanup()
      reject(err)
    }

    const timer = window.setTimeout(() => {
      cleanup()
      reject(new Error('Socket connection timed out'))
    }, timeoutMs)

    const cleanup = () => {
      clearTimeout(timer)
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
    }

    socket.on('connect', onConnect)
    socket.on('connect_error', onError)

    socket.connect()
  })
}
