import { SetMetadata } from '@nestjs/common';
import { GlobalRole } from 'src/model/domain/enums/global-role';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: GlobalRole[]) => SetMetadata(ROLES_KEY, roles);
