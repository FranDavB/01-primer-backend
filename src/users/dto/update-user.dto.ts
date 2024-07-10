import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    nombre?: string;

    @IsString()
    apellido?: string;
    
    @IsNumber()
    dni?: number;
  
    @IsNotEmpty()
    fecha: Date  
}
