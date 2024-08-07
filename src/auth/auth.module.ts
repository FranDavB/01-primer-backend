import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwtConstants';
import { CredencialesModule } from 'src/credenciales/credenciales.module';
import { WebSocketModule } from 'src/web-socket/web-socket.module';
import { WebSocketGateway } from '@nestjs/websockets';
import { PostSocketGateway } from 'src/web-socket/web-socket.gateway';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    CredencialesModule,
    UsersModule,
    JwtModule.register({
      global: true, // Esto es una importacion global de JwtModule en toda la app
      secret: jwtConstants.secret    }),
    WebSocketModule
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
