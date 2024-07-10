import { Global, Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { PostSocketGateway } from './web-socket.gateway';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PostsModule, // Importa el módulo donde se define PostsService y PostRepository
    UsersModule
  ],
  providers: [PostSocketGateway, WebSocketService],
})
export class WebSocketModule {}
