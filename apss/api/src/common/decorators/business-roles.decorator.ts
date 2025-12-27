import { SetMetadata } from '@nestjs/common';
import { BusinessRole } from 'src/model/domain/enums/business-role';

export const BUSINESS_ROLES_KEY = 'business_roles';
export const BusinessRoles = (...roles: BusinessRole[]) =>
    SetMetadata(BUSINESS_ROLES_KEY, roles);
