import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SERVICES_REPO, type ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class UpdateServiceUseCase {
    constructor(@Inject(SERVICES_REPO) private readonly repo: ServicesRepoPort) { }

    async exec(input: {
        businessId: string;
        serviceId: string;
        patch: {
            name?: string;
            description?: string | null;
            price?: string;
            durationMin?: number;
            serviceCategoryId?: string | null;
            imageUrl?: string | null;
            isActive?: boolean;
        };
    }) {
        if (input.patch.price !== undefined && Number.isNaN(Number(input.patch.price))) {
            throw new BadRequestException({ code: 'INVALID_PRICE', message: 'Price must be a decimal string' });
        }
        return this.repo.update({
            businessId: input.businessId,
            serviceId: input.serviceId,
            ...input.patch,
        });
    }
}
