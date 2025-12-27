import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SERVICE_CATEGORIES_REPO, type ServiceCategoriesRepoPort } from 'src/model/ports/repositories/service-categories.repo.port';

@Injectable()
export class CreateServiceCategoryUseCase {
    constructor(@Inject(SERVICE_CATEGORIES_REPO) private readonly repo: ServiceCategoriesRepoPort) { }

    async exec(input: { businessId: string; name: string }) {
        const exists = await this.repo.existsByName(input.businessId, input.name);
        if (exists) throw new ConflictException({ code: 'SERVICE_CATEGORY_NAME_TAKEN', message: 'Name already exists' });
        return this.repo.create(input);
    }
}
