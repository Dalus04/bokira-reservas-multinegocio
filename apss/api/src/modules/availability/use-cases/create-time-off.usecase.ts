import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { TIME_OFF_REPO, type TimeOffRepoPort } from 'src/model/ports/repositories/time-off.repo.port';

@Injectable()
export class CreateTimeOffUseCase {
    constructor(@Inject(TIME_OFF_REPO) private readonly repo: TimeOffRepoPort) { }

    async exec(input: {
        businessId: string;
        staffId: string | null;
        startAt: Date;
        endAt: Date;
        reason?: string | null;
        actorUserId: string;
        actorBusinessRole?: 'STAFF' | 'MANAGER';
    }) {
        if (input.endAt <= input.startAt) {
            throw new BadRequestException({ code: 'INVALID_RANGE', message: 'endAt must be after startAt' });
        }

        // permisos:
        // - bloqueo de negocio (staffId null): solo MANAGER
        // - bloqueo de staff: MANAGER o el mismo staff
        if (input.staffId === null) {
            if (input.actorBusinessRole !== 'MANAGER') {
                throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only MANAGER can block business' });
            }
        } else {
            const isSelf = input.staffId === input.actorUserId;
            const isManager = input.actorBusinessRole === 'MANAGER';
            if (!isSelf && !isManager) {
                throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Cannot block other staff' });
            }
        }

        return this.repo.create({
            businessId: input.businessId,
            staffId: input.staffId,
            startAt: input.startAt,
            endAt: input.endAt,
            reason: input.reason ?? null,
        });
    }
}
