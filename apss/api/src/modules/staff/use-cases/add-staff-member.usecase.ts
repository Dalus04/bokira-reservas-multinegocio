import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { STAFF_REPO, type StaffRepoPort } from 'src/model/ports/repositories/staff.repo.port';

@Injectable()
export class AddStaffMemberUseCase {
    constructor(@Inject(STAFF_REPO) private readonly repo: StaffRepoPort) { }

    async exec(businessId: string, dto: { email: string; role: 'STAFF' | 'MANAGER' }) {
        const userId = await this.repo.findUserIdByEmail(dto.email);
        if (!userId) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });

        const exists = await this.repo.existsMembership(businessId, userId);
        if (exists) throw new ConflictException({ code: 'MEMBER_ALREADY_EXISTS', message: 'Already a member' });

        return this.repo.add({ businessId, email: dto.email, role: dto.role });
    }
}
