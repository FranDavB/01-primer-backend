import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsNotEmpty()
  autorId?: number;

  @IsOptional()
  @IsString()
  contenido?: string;

}
