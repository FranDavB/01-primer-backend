import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { } // El constructor es necesario para determinar a que tabla de la db corresponde


  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserDto);
      return this.usersRepository.save(user);
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      return this.usersRepository.find({
        relations: ['roles'],
      });
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['roles']
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;

    } catch (error) {
      throw error
    }
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, updateUserDto)
    } catch (error) {
      throw error
    }
  }

  async remove(id: number): Promise<void> {
    const postAEliminar = await this.usersRepository.findOneBy({ id });
    if (!postAEliminar) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    await this.usersRepository.remove(postAEliminar);
  }
}
