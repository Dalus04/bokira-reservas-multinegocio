import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { BUSINESSES_REPO, type BusinessesRepoPort } from 'src/model/ports/repositories/businesses.repo.port';

@Injectable()
export class CreateBusinessUseCase {
    constructor(@Inject(BUSINESSES_REPO) private readonly repo: BusinessesRepoPort) { }

    async exec(ownerId: string, dto: any) {
        // slug unique: lo deja Prisma con P2002, pero damos 409 friendly
        try {
            return await this.repo.create({
                ownerId,
                platformCategoryId: dto.platformCategoryId,
                name: dto.name,
                slug: dto.slug,
                description: dto.description ?? null,
                address: dto.address ?? null,
                city: dto.city ?? null,
                phone: dto.phone ?? null,
                imageUrl: dto.imageUrl ?? null,
                timezone: dto.timezone ?? 'America/Lima',
            });
        } catch (e: any) {
            // si ya entra por PrismaExceptionFilter igual ok, pero esto mejora message
            throw new ConflictException({ code: 'BUSINESS_SLUG_TAKEN', message: 'Slug already in use' });
        }
    }
}
