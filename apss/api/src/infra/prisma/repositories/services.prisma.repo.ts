import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { ServicesRepoPort } from 'src/model/ports/repositories/services.repo.port';

@Injectable()
export class ServicesPrismaRepo implements ServicesRepoPort {
    constructor(private readonly prisma: PrismaService) { }

    async findForAvailability(serviceId: string) {
        const s = await this.prisma.service.findUnique({
            where: { id: serviceId },
            select: { id: true, businessId: true, durationMin: true, isActive: true },
        });
        return s ?? null;
    }
}
