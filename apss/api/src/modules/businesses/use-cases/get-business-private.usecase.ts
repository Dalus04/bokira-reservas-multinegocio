import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class GetBusinessPrivateUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    async exec(businessId: string) {
        const b = await this.repo.getById(businessId);
        if (!b) throw new NotFoundException({ code: 'BUSINESS_NOT_FOUND', message: 'Not found' });
        return b;
    }
}
