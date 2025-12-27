import { Inject, Injectable } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class ArchiveServiceUseCase {
    constructor(@Inject(SERVICES_REPO) private readonly repo: ServicesRepoPort) { }

    exec(input: { businessId: string; serviceId: string }) {
        return this.repo.archive(input.businessId, input.serviceId);
    }
}
