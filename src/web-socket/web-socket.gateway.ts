import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(9001, {
  cors: { origin: '*' }
})

export class PostSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly usersService: UsersService,
  ) { }

  @WebSocketServer() server: Server
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
    // Puedes agregar lógica adicional aquí si lo necesitas
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    client.handshake.headers.token
    // Puedes agregar lógica adicional aquí si lo necesitas
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit("conexion_finalizada", null)
    // Puedes agregar lógica adicional aquí si lo necesitas
  }

  //Para ejecutar eventos desde otros componentes
  public emitEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

}
