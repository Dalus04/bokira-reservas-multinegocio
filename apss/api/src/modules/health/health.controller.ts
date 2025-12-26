import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthDbUseCase } from './use-cases/health-db.usecase';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthDb: HealthDbUseCase) { }

    @Get('db')
    @ApiOperation({ summary: 'Healthcheck DB' })
    async db() {
        return this.healthDb.exec();
    }
}
