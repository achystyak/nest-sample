import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PublisherService } from './publisher.service';
import { User } from '../user/entities/user.entity';

@WebSocketGateway()
export class PublisherGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly service: PublisherService) { }

  private logger: Logger = new Logger('AppGateway');
  private clients: Socket[] = [];

  // Public methods
  // =============================================================================

  public async sendMessage(event: string, users: User[], message: string) {
    const allowedClients = this.service.clients(users);
    for (const client of this.clients) {
      if (allowedClients.includes(client.id)) {
        client.emit(event, message);
      }
    }
  }

  // Lifecycle events
  // =============================================================================

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i] === client) {
        this.clients.splice(i, 1);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.service.verify(client?.handshake?.headers?.authorization, client.id).then((verified) => {
      if (verified) {
        this.clients.push(client);
        this.logger.log(`Client connected: ${client.id}`);
      } else {
        client.disconnect();
      }
    })

  }
}