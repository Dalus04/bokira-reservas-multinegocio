import { Inject, Injectable } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class ListMyBusinessesUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    exec(userId: string, page: number, limit: number) {
        return this.repo.listMy(userId, page, limit);
    }
}
