import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { STAFF_REPO, type StaffRepoPort } from 'src/model/ports/repositories/staff.repo.port';

@Injectable()
export class UpdateStaffMemberUseCase {
    constructor(@Inject(STAFF_REPO) private readonly repo: StaffRepoPort) { }

    async exec(businessId: string, memberId: string, dto: { role?: any; isActive?: boolean }) {
        const existing = await this.repo.findMemberById(businessId, memberId);
        if (!existing) throw new NotFoundException({ code: 'MEMBER_NOT_FOUND', message: 'Not found' });

        if (dto.role === undefined && dto.isActive === undefined) {
            throw new BadRequestException({ code: 'INVALID_INPUT', message: 'Nothing to update' });
        }

        return this.repo.update(businessId, memberId, dto);
    }
}
