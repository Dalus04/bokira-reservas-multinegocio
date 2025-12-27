import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TIME_OFF_REPO, type TimeOffRepoPort } from 'src/model/ports/repositories/time-off.repo.port';

@Injectable()
export class DeleteTimeOffUseCase {
    constructor(@Inject(TIME_OFF_REPO) private readonly repo: TimeOffRepoPort) { }

    async exec(input: {
        businessId: string;
        timeOffId: string;
        actorUserId: string;
        actorBusinessRole?: 'STAFF' | 'MANAGER';
    }) {
        const existing = await this.repo.findById(input.businessId, input.timeOffId);
        if (!existing) throw new NotFoundException({ code: 'TIME_OFF_NOT_FOUND', message: 'Not found' });

        if (existing.staffId === null) {
            if (input.actorBusinessRole !== 'MANAGER') {
                throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only MANAGER can delete business block' });
            }
        } else {
            const isSelf = existing.staffId === input.actorUserId;
            const isManager = input.actorBusinessRole === 'MANAGER';
            if (!isSelf && !isManager) {
                throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Cannot delete other staff block' });
            }
        }

        await this.repo.delete(input.businessId, input.timeOffId);
        return { ok: true };
    }
}
