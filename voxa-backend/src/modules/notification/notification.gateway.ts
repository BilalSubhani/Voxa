import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>(); // userId => socketId

  registerUser(userId: string, socketId: string) {
    this.onlineUsers.set(userId, socketId);
  }

  unregisterUser(socketId: string) {
    const userId = [...this.onlineUsers.entries()].find(
      ([, sId]) => sId === socketId,
    )?.[0];
    if (userId) this.onlineUsers.delete(userId);
  }

  sendNotification(userId: string, payload: any) {
    const socketId = this.onlineUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', payload);
    }
  }
}
