import { Inject, Injectable } from '@nestjs/common';
import { STAFF_REPO, type StaffRepoPort } from 'src/model/ports/repositories/staff.repo.port';

@Injectable()
export class ListStaffUseCase {
    constructor(@Inject(STAFF_REPO) private readonly repo: StaffRepoPort) { }

    exec(businessId: string, page: number, limit: number) {
        return this.repo.list(businessId, page, limit);
    }
}
