import { Inject, Injectable } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class AdminSuspendBusinessUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    exec(businessId: string, adminId: string, reason?: string) {
        return this.repo.adminSuspend(businessId, adminId, reason ?? null);
    }
}
