import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    PLATFORM_CATEGORIES_REPO,
    type PlatformCategoriesRepoPort,
} from 'src/model/ports/repositories/platform-categories.repo.port';

@Injectable()
export class GetPlatformCategoryBySlugUseCase {
    constructor(
        @Inject(PLATFORM_CATEGORIES_REPO)
        private readonly repo: PlatformCategoriesRepoPort,
    ) { }

    async exec(slug: string) {
        const item = await this.repo.getBySlug(slug);
        if (!item) throw new NotFoundException({ code: 'PLATFORM_CATEGORY_NOT_FOUND', message: 'Not found' });
        return item;
    }
}
