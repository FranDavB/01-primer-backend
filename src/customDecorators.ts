import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

//Decorador @Roles

const ROLES_KEY = 'roles';
const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

//Decorador @Public

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true); //Public es el decorador

export { ROLES_KEY, Roles, IS_PUBLIC_KEY, Public }
