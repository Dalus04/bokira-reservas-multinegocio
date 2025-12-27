import { Inject, Injectable } from '@nestjs/common';
import { BOOKINGS_REPO, type BookingsRepoPort } from 'src/model/ports/repositories/bookings.repo.port';

@Injectable()
export class ListBookingsUseCase {
    constructor(@Inject(BOOKINGS_REPO) private readonly repo: BookingsRepoPort) { }

    exec(input: {
        businessId: string;
        from?: Date;
        to?: Date;
        status?: string;
        staffId?: string;
        page: number;
        limit: number;
        actorRole?: 'STAFF' | 'MANAGER';
        actorUserId: string;
    }) {
        const staffId =
            input.actorRole === 'STAFF' ? input.actorUserId : input.staffId;

        return this.repo.list({
            businessId: input.businessId,
            from: input.from,
            to: input.to,
            status: input.status,
            staffId,
            page: input.page,
            limit: input.limit,
        });
    }
}
