import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AVAILABILITY_REPO, type AvailabilityRepoPort } from 'src/model/ports/repositories/availability.repo.port';

@Injectable()
export class UpsertStaffWorkingHoursUseCase {
    constructor(@Inject(AVAILABILITY_REPO) private readonly repo: AvailabilityRepoPort) { }

    exec(businessId: string, staffId: string, weekly: any[]) {
        if (!staffId) throw new BadRequestException({ code: 'INVALID_INPUT', message: 'staffId required' });
        if (!Array.isArray(weekly) || weekly.length === 0) {
            throw new BadRequestException({ code: 'INVALID_INPUT', message: 'weekly is required' });
        }
        return this.repo.upsertStaffWorkingHours(businessId, staffId, weekly);
    }
}
