import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppUpdatePayload } from './interfaces/app-update.interface';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitAppUpdate(appId: number, data: AppUpdatePayload) {
    this.server.emit('app_update', { id: appId, ...data });
  }
}
