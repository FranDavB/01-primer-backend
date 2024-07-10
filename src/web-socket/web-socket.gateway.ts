import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Server, Socket } from 'socket.io';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(9001, {
  cors: { origin: '*' }
})

export class PostSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService
  ) { }

  @WebSocketServer() server: Server

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
    // Puedes agregar lógica adicional aquí si lo necesitas
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // Puedes agregar lógica adicional aquí si lo necesitas
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Puedes agregar lógica adicional aquí si lo necesitas
  }

  @SubscribeMessage("post-enviado")
  async handleIncomingPost(
    @MessageBody() postData: Post
  ) {
    console.log(postData)
    try {
      const post = await this.postsService.create(postData); // Asegurarse de esperar la creación del post
      const nombre = post.nombre // Usar el post creado para asegurar que tiene los datos correctos
      const autor = await this.usersService.findOne(postData.autorId)
      const datosPost = { nombre, autor }
      
      this.server.emit('actualizar_posts', post)
      this.server.emit('post_agregado', datosPost)
    } catch (error) {
      throw error
    }
  }

}
