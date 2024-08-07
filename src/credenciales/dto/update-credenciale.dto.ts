import { PartialType } from '@nestjs/swagger';
import { CreateCredencialeDto } from './create-credenciale.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateCredencialeDto extends PartialType(CreateCredencialeDto) {
    @IsString()
    refresh_token?: string;

    @IsNumber()
    dni?: number;

    @IsString()
    contraseña?: string;
}
