import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

export const ROLES_KEY = 'roles';

// es. @Roles(UserRole.ADMIN) sopra un endpoint
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);