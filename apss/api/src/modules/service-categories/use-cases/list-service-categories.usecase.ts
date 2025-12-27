import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_CATEGORIES_REPO, type ServiceCategoriesRepoPort } from 'src/model/ports/repositories/service-categories.repo.port';

@Injectable()
export class ListServiceCategoriesUseCase {
    constructor(@Inject(SERVICE_CATEGORIES_REPO) private readonly repo: ServiceCategoriesRepoPort) { }

    async exec(input: { businessId: string; q?: string }) {
        const items = await this.repo.list({ businessId: input.businessId });
        if (!input.q) return items;
        const q = input.q.toLowerCase();
        return items.filter((x: any) => String(x.name).toLowerCase().includes(q));
    }
}
