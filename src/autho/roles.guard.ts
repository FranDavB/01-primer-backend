import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY, ROLES_KEY } from "src/customDecorators";
import { Role } from "src/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    // Si la funcion no es publica como el login, se ejecuta lo de abajo
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    // Si no hay roles especificos requeridos, se ejecuta lo de abajo

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extrae el token del header Authorization

    if (!token) {
      return false;
    }

    const payload = await this.jwtService.decode(token);
    const userRoles = payload.roles || []; // Obtiene los roles del payload

    try {
      return requiredRoles.some((role) => userRoles.includes(role));
    } catch {
      throw new HttpException('Usuario no autorizado', HttpStatus.UNAUTHORIZED)
    }

  }
}