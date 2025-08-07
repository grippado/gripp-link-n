import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { defineEventHandler } from "h3";
import { createServer } from "node:http";

export default defineNitroPlugin((nitro) => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  const engine = io.engine;

  // Track active sessions
  const activeSessions = new Map();

  io.on("connection", (socket: Socket) => {
    console.log('Client connected', socket.id);
    
    // Send initial session status
    socket.emit('session_status', { active: false });
    
    // Handle session start
    socket.on('start_session', () => {
      console.log('Session started by', socket.id);
      activeSessions.set(socket.id, {
        startTime: new Date(),
        positions: [
          { x: 20, y: 30, type: 'guard' },
          { x: 60, y: 40, type: 'mount' }
        ]
      });
      
      // Broadcast to all clients that session is active
      io.emit('session_status', { active: true });
      io.emit('position_update', { positions: activeSessions.get(socket.id).positions });
    });
    
    // Handle session end
    socket.on('end_session', () => {
      console.log('Session ended by', socket.id);
      activeSessions.delete(socket.id);
      
      // If no more active sessions, broadcast inactive status
      if (activeSessions.size === 0) {
        io.emit('session_status', { active: false });
        io.emit('position_update', { positions: [] });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
      if (activeSessions.has(socket.id)) {
        activeSessions.delete(socket.id);
        
        // If no more active sessions, broadcast inactive status
        if (activeSessions.size === 0) {
          io.emit('session_status', { active: false });
          io.emit('position_update', { positions: [] });
        }
      }
    });
  });

  nitro.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      httpServer.listeners('request').forEach(listener => {
        listener(event.node.req, event.node.res);
      });
      event._handled = true;
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq);
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
      }
    }
  }));
});