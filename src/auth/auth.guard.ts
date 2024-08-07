import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { jwtConstants } from "./jwtConstants";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/customDecorators";
import { CredencialesService } from "src/credenciales/credenciales.service";
import { Response } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly credencialService: CredencialesService
  ) { }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      console.log('canActivate public called');

      return true;
    }

    console.log('canActivate token called');
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException('Unauthorized: No token provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
      request.user = payload;
      console.log('Token de acceso válido')
      return true;

    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log('Token expired, attempting to refresh');

        try {
          const tokenDecoded = await this.jwtService.decode(token) as any;
          const credencialId = tokenDecoded?.sub;

          if (!credencialId) {
            throw new HttpException('Unauthorized: No credential ID in token', HttpStatus.UNAUTHORIZED);
          }

          const credencial = await this.credencialService.findOne(parseInt(credencialId));
          const refreshToken = credencial.refresh_token;

          if (!refreshToken) {
            throw new HttpException('Unauthorized: No refresh token available', HttpStatus.UNAUTHORIZED);
          }

          try {
            await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.secret });
          } catch (refreshErr) {
            if (refreshErr instanceof TokenExpiredError) {
              console.log('Refresh token expired');
              throw new HttpException('Unauthorized: Refresh token expired', HttpStatus.UNAUTHORIZED);
            } else {
              console.error('Invalid refresh token:', refreshErr);
              throw new HttpException('Unauthorized: Invalid refresh token', HttpStatus.UNAUTHORIZED);
            }
          }

          const roles = credencial.user.roles.map(role => role.nombre);
          const permissions = credencial.user.roles.flatMap(role => role.permissions.map(permission => permission.nombre));
          const userInfo = { nombre: credencial.user.nombre, apellido: credencial.user.apellido };

          const payload = {
            sub: credencial.id,
            roles: roles,
            permission: permissions,
            user: userInfo,
          };

          const newAccessToken = await this.jwtService.signAsync(payload, { expiresIn: '1m' });

          // Agregar el nuevo access_token a la respuesta
          response.setHeader('Authorization', `Bearer ${newAccessToken}`);
          console.log('New Access Token:', response.getHeader('Authorization'));
          return true;
        } catch (error) {
          console.error('Error handling expired token:', error);
          throw new HttpException('Unauthorized: Error handling expired token', HttpStatus.UNAUTHORIZED);
        }

      } else {
        console.error('JWT verification error:', err);
        throw new HttpException('Unauthorized: Invalid token', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
