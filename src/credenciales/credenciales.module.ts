import { Global, Module } from '@nestjs/common';
import { CredencialesService } from './credenciales.service';
import { CredencialesController } from './credenciales.controller';
import { Credenciale } from './entities/credenciale.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Credenciale, User])],
  controllers: [CredencialesController],
  providers: [CredencialesService],

  exports: [CredencialesService]
})
export class CredencialesModule {}
