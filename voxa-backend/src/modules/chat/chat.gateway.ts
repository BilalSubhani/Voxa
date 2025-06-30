// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');
  private onlineUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.server.emit('user-offline', userId);
        this.logger.log(`User offline: ${userId}`);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('user-online')
  handleUserOnline(client: Socket, userId: string) {
    this.onlineUsers.set(userId, client.id);
    this.server.emit('user-online', userId);
    this.logger.log(`User online: ${userId}`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    client: Socket,
    payload: { senderId: string; receiverId: string; content: string },
  ) {
    const message = await this.chatService.saveMessage(payload);
    const receiverSocket = this.onlineUsers.get(payload.receiverId);

    if (receiverSocket) {
      this.server.to(receiverSocket).emit('receive-message', message);
    }

    client.emit('message-sent', message);
  }
}
