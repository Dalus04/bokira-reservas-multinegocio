import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SERVICE_CATEGORIES_REPO, type ServiceCategoriesRepoPort } from 'src/model/ports/repositories/service-categories.repo.port';

@Injectable()
export class UpdateServiceCategoryUseCase {
    constructor(@Inject(SERVICE_CATEGORIES_REPO) private readonly repo: ServiceCategoriesRepoPort) { }

    async exec(input: { businessId: string; categoryId: string; name: string }) {
        const current = await this.repo.findById(input.businessId, input.categoryId);
        if (!current) throw new NotFoundException({ code: 'SERVICE_CATEGORY_NOT_FOUND', message: 'Not found' });

        if (current.name !== input.name) {
            const exists = await this.repo.existsByName(input.businessId, input.name);
            if (exists) throw new ConflictException({ code: 'SERVICE_CATEGORY_NAME_TAKEN', message: 'Name already exists' });
        }

        return this.repo.update(input);
    }
}
