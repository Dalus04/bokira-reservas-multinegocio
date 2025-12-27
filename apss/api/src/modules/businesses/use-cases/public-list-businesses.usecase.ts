import { Inject, Injectable } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class PublicListBusinessesUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    exec(input: { q?: string; city?: string; categorySlug?: string; page: number; limit: number }) {
        return this.repo.publicList(input);
    }
}
