import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private onlineUsers: Map<string, string> = new Map(); // userId => socketId

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.onlineUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('register')
  async registerUser(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineUsers.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    payload: {
      sender: string;
      receiver: string;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const savedMessage = await this.chatService.saveMessage(
      payload.sender,
      payload.receiver,
      payload.content,
    );

    const decrypted = {
      ...savedMessage.toObject(),
      content: payload.content,
    };

    const receiverSocketId = this.onlineUsers.get(payload.receiver);
    const senderSocketId = this.onlineUsers.get(payload.sender);

    if (receiverSocketId) {
      client.to(receiverSocketId).emit('receive_message', decrypted);
    }

    if (senderSocketId && senderSocketId !== client.id) {
      client.to(senderSocketId).emit('message_sent', decrypted);
    }
  }
}
