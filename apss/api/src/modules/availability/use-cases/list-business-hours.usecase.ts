import { Inject, Injectable } from '@nestjs/common';
import { AVAILABILITY_REPO, type AvailabilityRepoPort } from 'src/model/ports/repositories/availability.repo.port';

@Injectable()
export class ListBusinessHoursUseCase {
    constructor(@Inject(AVAILABILITY_REPO) private readonly repo: AvailabilityRepoPort) { }
    exec(businessId: string) {
        return this.repo.listBusinessHours(businessId);
    }
}
