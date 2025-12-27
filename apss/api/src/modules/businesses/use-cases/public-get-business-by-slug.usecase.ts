import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class PublicGetBusinessBySlugUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    async exec(slug: string) {
        const b = await this.repo.publicGetBySlug(slug);
        if (!b) throw new NotFoundException({ code: 'BUSINESS_NOT_FOUND', message: 'Not found' });

        if (!b.isActive || b.status !== 'APPROVED') {
            throw new ForbiddenException({ code: 'BUSINESS_NOT_AVAILABLE', message: 'Business not available' });
        }
        return b;
    }
}
