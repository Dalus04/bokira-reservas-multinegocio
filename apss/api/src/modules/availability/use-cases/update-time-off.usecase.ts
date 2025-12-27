import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TIME_OFF_REPO, type TimeOffRepoPort } from 'src/model/ports/repositories/time-off.repo.port';

@Injectable()
export class UpdateTimeOffUseCase {
    constructor(@Inject(TIME_OFF_REPO) private readonly repo: TimeOffRepoPort) { }

    async exec(input: {
        businessId: string;
        timeOffId: string;
        startAt?: Date;
        endAt?: Date;
        reason?: string | null;
        actorUserId: string;
        actorBusinessRole?: 'STAFF' | 'MANAGER';
    }) {
        const existing = await this.repo.findById(input.businessId, input.timeOffId);
        if (!existing) throw new NotFoundException({ code: 'TIME_OFF_NOT_FOUND', message: 'Not found' });

        // permisos: mismo criterio que create
        if (existing.staffId === null) {
            if (input.actorBusinessRole !== 'MANAGER') {
                throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only MANAGER can edit business block' });
            }
        } else {
            const isSelf = existing.staffId === input.actorUserId;
            const isManager = input.actorBusinessRole === 'MANAGER';
            if (!isSelf && !isManager) {
                throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Cannot edit other staff block' });
            }
        }

        const startAt = input.startAt ?? existing.startAt;
        const endAt = input.endAt ?? existing.endAt;
        if (endAt <= startAt) {
            throw new BadRequestException({ code: 'INVALID_RANGE', message: 'endAt must be after startAt' });
        }

        return this.repo.update(input.businessId, input.timeOffId, {
            startAt: input.startAt,
            endAt: input.endAt,
            reason: input.reason,
        });
    }
}
