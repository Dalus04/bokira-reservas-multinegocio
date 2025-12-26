import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class HealthDbUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async exec() {
        // query mínima para validar conexión
        await this.prisma.$queryRaw`SELECT 1`;
        return { ok: true, db: 'up' as const };
    }
}
