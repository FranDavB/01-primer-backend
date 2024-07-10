import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsDate()
  cumpleanios: Date;

  @IsNotEmpty()
  @IsNumber()
  dni: number
}
