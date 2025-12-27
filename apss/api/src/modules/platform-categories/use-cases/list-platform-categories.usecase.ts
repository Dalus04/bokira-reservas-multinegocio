import { Inject, Injectable } from '@nestjs/common';
import {
    PLATFORM_CATEGORIES_REPO,
    type PlatformCategoriesRepoPort,
} from 'src/model/ports/repositories/platform-categories.repo.port';

@Injectable()
export class ListPlatformCategoriesUseCase {
    constructor(
        @Inject(PLATFORM_CATEGORIES_REPO)
        private readonly repo: PlatformCategoriesRepoPort,
    ) { }

    exec(input: { q?: string; page: number; limit: number }) {
        return this.repo.list(input);
    }
}
