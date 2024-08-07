import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credenciale } from 'src/credenciales/entities/credenciale.entity';
import { CredencialesService } from 'src/credenciales/credenciales.service';
import { permission } from 'process';

@Injectable()
export class AuthService {

  constructor(
    private readonly credencialeService: CredencialesService,
    private jwtService: JwtService
  ) { }

  async signIn(credenciales: any): Promise<{ access_token: string }> {

    let credencial: Credenciale = await this.credencialeService.findOneByDNI(credenciales.dni);

    console.log(credencial)
    if (credencial?.contraseña !== credenciales.contraseña) {
      throw new UnauthorizedException();
    }

    // Generar un refresh_token y colocarlo en la db

    const payloadRefresh = {
      sub: credencial.id,
    }

    const refresh_token = {
      refresh_token: await this.jwtService.signAsync(payloadRefresh, { expiresIn: '20m' })
    };

    const addCredencial = await this.credencialeService.update(credencial.id, refresh_token)

    credencial = await this.credencialeService.findOneByDNI(credenciales.dni)

    // Extraer roles y permisos
    const roles = credencial.user.roles.map(role => role.nombre);
    const permissions = credencial.user.roles.flatMap(role => role.permissions.map(permission => permission.nombre));
    const userInfo = { nombre: credencial.user.nombre, apellido: credencial.user.apellido }

    // Generar un access_token para pasarlo al front
    const payload = {
      sub: credencial.id,
      roles: roles,
      permission: permissions,
      user: userInfo,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn: '1m' }) //signAsync para crear un token a partir de los datos de payload
      // entonces el JWT se devuelve en la propiedad access_token
    };
  }

}
