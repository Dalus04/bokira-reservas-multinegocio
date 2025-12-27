import { Inject, Injectable } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class ListPublicServicesUseCase {
    constructor(@Inject(SERVICES_REPO) private readonly repo: ServicesRepoPort) { }

    exec(input: { businessId: string; q?: string; categoryId?: string; page: number; limit: number }) {
        return this.repo.publicList(input);
    }
}
