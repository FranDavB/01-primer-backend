import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }  // Se deben agregar las tablas de la DB aca. Además, por cada una le va la etiqueta @InjectRepository

  async create(createPostDto: CreatePostDto): Promise<Post> { //Se debe buscar el autor antes de cualquier otra cosa
    try {
      const autor = await this.usersRepository.findOne({ where: { id: createPostDto.autorId } });
      if (!autor) {
        throw new NotFoundException(`User with ID ${createPostDto.autorId} not found`);
      }
      const post = this.postsRepository.create(createPostDto);
      return this.postsRepository.save(post);

    } catch (error) {
      throw error
    }

  }

  async findAll() {
    try {
      return this.postsRepository.find({ relations: ['autor'] });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({ where: { id }, relations: ['autor'] });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return post;

    } catch (error) {
      throw error
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({ where: { id } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      if (updatePostDto.autorId) {
        const autor = await this.usersRepository.findOne({ where: { id: updatePostDto.autorId } });
        if (!autor) {
          throw new NotFoundException(`User with ID ${updatePostDto.autorId} not found`);
        }
      }

      Object.assign(post, updatePostDto);
      return this.postsRepository.save(post);

    } catch (error) {
      throw error
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const postAEliminar = await this.postsRepository.findOneBy({ id });
      if (!postAEliminar) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      await this.postsRepository.remove(postAEliminar);

    } catch (error) {
      throw error
    }
  }
}
