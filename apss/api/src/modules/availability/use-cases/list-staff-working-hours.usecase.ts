import { Inject, Injectable } from '@nestjs/common';
import { AVAILABILITY_REPO, type AvailabilityRepoPort } from 'src/model/ports/repositories/availability.repo.port';

@Injectable()
export class ListStaffWorkingHoursUseCase {
    constructor(@Inject(AVAILABILITY_REPO) private readonly repo: AvailabilityRepoPort) { }
    exec(businessId: string, staffId: string) {
        return this.repo.listStaffWorkingHours(businessId, staffId);
    }
}
