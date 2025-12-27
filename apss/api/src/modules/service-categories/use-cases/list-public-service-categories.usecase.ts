import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_CATEGORIES_REPO, type ServiceCategoriesRepoPort } from 'src/model/ports/repositories/service-categories.repo.port';

@Injectable()
export class ListPublicServiceCategoriesUseCase {
    constructor(@Inject(SERVICE_CATEGORIES_REPO) private readonly repo: ServiceCategoriesRepoPort) { }

    exec(input: { businessId: string }) {
        return this.repo.list({ businessId: input.businessId });
    }
}
