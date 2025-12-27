import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class CreateServiceUseCase {
    constructor(@Inject(SERVICES_REPO) private readonly repo: ServicesRepoPort) { }

    async exec(input: {
        businessId: string;
        name: string;
        description?: string | null;
        price: string;
        durationMin: number;
        serviceCategoryId?: string | null;
        imageUrl?: string | null;
    }) {
        if (Number.isNaN(Number(input.price))) {
            throw new BadRequestException({ code: 'INVALID_PRICE', message: 'Price must be a decimal string' });
        }
        return this.repo.create({
            businessId: input.businessId,
            name: input.name,
            description: input.description ?? null,
            price: input.price,
            durationMin: input.durationMin,
            serviceCategoryId: input.serviceCategoryId ?? null,
            imageUrl: input.imageUrl ?? null,
        });
    }
}
