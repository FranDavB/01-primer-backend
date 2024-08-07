import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredencialeDto } from './dto/create-credenciale.dto';
import { UpdateCredencialeDto } from './dto/update-credenciale.dto';
import { Credenciale } from './entities/credenciale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CredencialesService {

  constructor(
    @InjectRepository(Credenciale)
    private readonly credencialesRepository: Repository<Credenciale>
  ) { }
  create(createCredencialeDto: CreateCredencialeDto) {
    return 'This action adds a new credenciale';
  }

  findAll() {
    return `This action returns all credenciales`;
  }

  async findOne(id: number): Promise<Credenciale> {
    return this.credencialesRepository.findOne({
      where: { id },
      relations: ['user', 'user.roles', 'user.roles.permissions']
    })
  }

  async findOneByDNI(dni: number): Promise<Credenciale> {
    return this.credencialesRepository.findOne({
      where: { dni },
      relations: ['user', 'user.roles', 'user.roles.permissions']
    });
  }

  async update(id: number, updateCredencialeDto: UpdateCredencialeDto) {
    try {
      const updatedCredencial = await this.credencialesRepository.update(id, updateCredencialeDto)
      return updatedCredencial
    } catch (error) {
      throw error
    }
  }

  remove(id: number) {
    return `This action removes a #${id} credenciale`;
  }
}
