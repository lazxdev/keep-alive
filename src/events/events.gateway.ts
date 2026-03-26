import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitAppUpdate(appId: number, data: any) {
    this.server.emit('app_update', { id: appId, ...data });
  }
}
