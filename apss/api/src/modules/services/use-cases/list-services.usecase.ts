import { Inject, Injectable } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class ListServicesUseCase {
    constructor(@Inject(SERVICES_REPO) private readonly repo: ServicesRepoPort) { }

    exec(input: { businessId: string; q?: string; categoryId?: string; isActive?: boolean; page: number; limit: number }) {
        return this.repo.list(input);
    }
}
