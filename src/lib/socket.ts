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
    console.log('[socket] attempting connection...')
    s.connect()
  }
  return s
}

export function disconnectSocket() {
  if (!socket) return
  console.log('[socket] disconnect requested')
  socket.disconnect()
  console.log('[socket] connected after disconnect?', socket.connected)
}

export function setupSocket() {
  const socket = connectSocket()
  socket.off('server:ready')
  socket.on('server:ready', (msg) => console.log('[socket] server ready', msg))

  socket.off('connect')
  socket.on('connect', () =>
    console.log('[socket] connected', {
      id: socket.id,
      ts: new Date().toISOString(),
    })
  )

  socket.off('disconnect')
  socket.on('disconnect', (reason) =>
    console.log('[socket] disconnected', {
      reason,
      ts: new Date().toISOString(),
    })
  )

  socket.off('connect_error')
  socket.on('connect_error', (err) =>
    console.log('[socket] connect_error', {
      message: err.message,
      stack: err.stack,
    })
  )

  socket.off('reconnect_attempt')
  socket.on('reconnect_attempt', (attempt) =>
    console.log('[socket] reconnect attempt', attempt)
  )
}
