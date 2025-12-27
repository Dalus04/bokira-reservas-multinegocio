import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class GetServiceUseCase {
    constructor(@Inject(SERVICES_REPO) private readonly repo: ServicesRepoPort) { }

    async exec(input: { businessId: string; serviceId: string }) {
        const row = await this.repo.findById(input.businessId, input.serviceId);
        if (!row) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Not found' });
        return row;
    }
}
