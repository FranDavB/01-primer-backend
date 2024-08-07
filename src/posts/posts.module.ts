import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { WebSocketModule } from 'src/web-socket/web-socket.module';
import { CredencialesModule } from 'src/credenciales/credenciales.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), WebSocketModule, CredencialesModule], // Para poder usar la tabla User, se debe importar en el modulo
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule { }
