import { Module } from '@nestjs/common';

import { StaffController } from './staff.controller';
import { ListStaffUseCase } from './use-cases/list-staff.usecase';
import { AddStaffMemberUseCase } from './use-cases/add-staff-member.usecase';
import { UpdateStaffMemberUseCase } from './use-cases/update-staff-member.usecase';

import { StaffPrismaRepo } from '../../infra/prisma/repositories/staff.prisma.repo';
import { staffRepoProvider } from '../../infra/prisma/repositories/staff.repo.provider';

@Module({
    controllers: [StaffController],
    providers: [
        ListStaffUseCase,
        AddStaffMemberUseCase,
        UpdateStaffMemberUseCase,

        StaffPrismaRepo,
        staffRepoProvider,
    ],
})
export class StaffModule { }
