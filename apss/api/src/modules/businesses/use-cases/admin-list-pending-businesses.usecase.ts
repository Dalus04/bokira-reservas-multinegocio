import { Inject, Injectable } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';
import { BusinessStatus } from 'src/model/domain/enums/business-status';

@Injectable()
export class AdminListBusinessesUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    exec(query: { status?: string; page: number; limit: number }) {
        return this.repo.adminList({
            status: (query.status as BusinessStatus) ?? undefined,
            page: query.page,
            limit: query.limit,
        });
    }
}
