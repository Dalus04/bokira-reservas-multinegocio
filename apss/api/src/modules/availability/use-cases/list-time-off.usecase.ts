import { Inject, Injectable } from '@nestjs/common';
import { TIME_OFF_REPO, type TimeOffRepoPort } from 'src/model/ports/repositories/time-off.repo.port';

@Injectable()
export class ListTimeOffUseCase {
    constructor(@Inject(TIME_OFF_REPO) private readonly repo: TimeOffRepoPort) { }

    exec(q: { businessId: string; staffId?: string; from?: Date; to?: Date }) {
        return this.repo.list(q);
    }
}
