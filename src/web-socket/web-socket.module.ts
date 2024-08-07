import { Global, Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { PostSocketGateway } from './web-socket.gateway';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [
    UsersModule,
  ],
  providers: [PostSocketGateway, WebSocketService],
  exports: [PostSocketGateway]
})
export class WebSocketModule { }
